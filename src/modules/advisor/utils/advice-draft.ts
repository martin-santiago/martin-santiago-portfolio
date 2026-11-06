import { partialParse } from "@anthropic-ai/sdk/_vendor/partial-json-parser/parser";

import { ADVICE_STANCES, type PortfolioAdvice, type StockRecommendation } from "../entities/portfolio-advice";

type AdvicePrefix = { summary?: string; recommendations?: Partial<StockRecommendation>[] };

type RecommendationWithHeader = Omit<StockRecommendation, "rationale"> & { rationale?: string };

const INCOMPLETE_ESCAPE_AT_END = /(?<!\\)((?:\\\\)*)\\(u[0-9a-fA-F]{0,3})?$/;

function hasHeader(recommendation: Partial<StockRecommendation>): recommendation is RecommendationWithHeader {
  const hasKnownStance = ADVICE_STANCES.some((stance) => stance === recommendation.stance);
  return hasKnownStance && typeof recommendation.agreesWithPlan === "boolean";
}

function tryPartialParse(adviceJson: string): AdvicePrefix | null {
  try {
    return partialParse(adviceJson) as AdvicePrefix;
  } catch {
    return null;
  }
}

// partialParse drops unterminated strings, so the open one is closed first to show text as it is written.
function parseAdvicePrefix(adviceJson: string): AdvicePrefix {
  if (!adviceJson) return {};
  const closedAdviceJson = `${adviceJson.replace(INCOMPLETE_ESCAPE_AT_END, "$1")}"`;
  return tryPartialParse(closedAdviceJson) ?? tryPartialParse(adviceJson) ?? {};
}

// Structured outputs keep Claude to the schema's key order: once agreesWithPlan shows up, symbol and stance are complete.
export function toAdviceDraft(adviceJson: string): PortfolioAdvice {
  const { summary = "", recommendations = [] } = parseAdvicePrefix(adviceJson);
  return {
    summary,
    recommendations: recommendations
      .filter(hasHeader)
      .map((recommendation) => ({ ...recommendation, rationale: recommendation.rationale ?? "" })),
  };
}
