import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import type { BetaMessage, BetaTextBlock } from "@anthropic-ai/sdk/resources/beta/messages/messages";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";

import type { Locale } from "@/common/i18n/locales";

import {
  ADVICE_CACHE_MAX_ENTRIES,
  ADVICE_CACHE_TTL_MS,
  ADVISOR_EFFORT,
  ADVISOR_MAX_RETRIES,
  ADVISOR_MAX_TOKENS,
  ADVISOR_MODEL,
  ADVISOR_STREAM_TIMEOUT_MS,
  ADVISOR_TIMEOUT_MS,
  SERVER_SIDE_FALLBACK_BETA,
} from "../constants/advisor-model";
import { ADVICE_LANGUAGE_INSTRUCTIONS, ADVISOR_SYSTEM_PROMPT } from "../constants/advisor-prompt";
import { ADVICE_STANCES, type AdviceStreamEvent, type PortfolioAdvice } from "../entities/portfolio-advice";
import type { PortfolioSnapshot } from "../entities/portfolio-snapshot";
import type { AdviceRepository } from "./advice.repository";

type CachedAdvice = { advice: PortfolioAdvice; expiresAt: number };

const portfolioAdviceSchema: z.ZodType<PortfolioAdvice> = z.object({
  summary: z.string(),
  recommendations: z.array(
    z.object({
      symbol: z.string(),
      stance: z.enum(ADVICE_STANCES),
      agreesWithPlan: z.boolean(),
      rationale: z.string(),
    }),
  ),
});

const anthropic = new Anthropic({ timeout: ADVISOR_TIMEOUT_MS, maxRetries: ADVISOR_MAX_RETRIES });

// Without the SDK's parse step: after a mid-answer fallback it would also parse the declining model's unfinished text.
const ADVICE_OUTPUT_FORMAT = { type: "json_schema", schema: betaZodOutputFormat(portfolioAdviceSchema).schema } as const;

// ponytail: per-instance memory because 'use cache' can't hold a stream; move to a shared store if the public deploy gets abused
const cachedAdviceByRequest = new Map<string, CachedAdvice>();

function readCachedAdvice(cacheKey: string): PortfolioAdvice | null {
  const cachedAdvice = cachedAdviceByRequest.get(cacheKey);
  return cachedAdvice && cachedAdvice.expiresAt > Date.now() ? cachedAdvice.advice : null;
}

function cacheAdvice(cacheKey: string, advice: PortfolioAdvice): void {
  cachedAdviceByRequest.delete(cacheKey);
  if (cachedAdviceByRequest.size >= ADVICE_CACHE_MAX_ENTRIES) {
    const [oldestCacheKey] = cachedAdviceByRequest.keys();
    cachedAdviceByRequest.delete(oldestCacheKey);
  }
  cachedAdviceByRequest.set(cacheKey, { advice, expiresAt: Date.now() + ADVICE_CACHE_TTL_MS });
}

function requestAdviceStream(snapshot: PortfolioSnapshot, locale: Locale) {
  return anthropic.beta.messages.stream(
    {
      model: ADVISOR_MODEL,
      max_tokens: ADVISOR_MAX_TOKENS,
      betas: [SERVER_SIDE_FALLBACK_BETA],
      fallbacks: "default",
      system: `${ADVISOR_SYSTEM_PROMPT}\n\n${ADVICE_LANGUAGE_INSTRUCTIONS[locale]}`,
      output_config: { format: ADVICE_OUTPUT_FORMAT, effort: ADVISOR_EFFORT },
      messages: [{ role: "user", content: JSON.stringify(snapshot) }],
    },
    { signal: AbortSignal.timeout(ADVISOR_STREAM_TIMEOUT_MS) },
  );
}

function readAdvice(message: BetaMessage): PortfolioAdvice {
  if (message.stop_reason === "refusal") throw new Error("Claude declined to review this portfolio");
  const answer = message.content.findLast((block): block is BetaTextBlock => block.type === "text");
  if (!answer) throw new Error(`Claude returned no advice (stop reason: ${message.stop_reason})`);
  return portfolioAdviceSchema.parse(JSON.parse(answer.text));
}

async function* streamAdvice(snapshot: PortfolioSnapshot, locale: Locale): AsyncGenerator<AdviceStreamEvent> {
  const cacheKey = JSON.stringify({ snapshot, locale });
  const cachedAdvice = readCachedAdvice(cacheKey);
  if (cachedAdvice) {
    yield { status: "ok", advice: cachedAdvice };
    return;
  }

  const adviceStream = requestAdviceStream(snapshot, locale);
  for await (const streamEvent of adviceStream) {
    if (streamEvent.type === "content_block_start" && streamEvent.content_block.type === "fallback") {
      yield { status: "restarted" };
    }
    if (streamEvent.type === "content_block_delta" && streamEvent.delta.type === "text_delta") {
      yield { status: "writing", text: streamEvent.delta.text };
    }
  }

  const advice = readAdvice(await adviceStream.finalMessage());
  cacheAdvice(cacheKey, advice);
  yield { status: "ok", advice };
}

export const claudeAdviceRepository: AdviceRepository = { streamAdvice };
