import "server-only";

import { isEnvConfigured } from "@/common/utils/env";
import type { Locale } from "@/common/i18n/locales";
import { type PortfolioService, portfolioService } from "@/modules/portfolio/services/portfolio.service";

import type { PortfolioAdviceDto } from "../dtos/portfolio-advice.dto";
import type { AdviceRepository } from "../repositories/advice.repository";
import { claudeAdviceRepository } from "../repositories/claude-advice.repository";
import { toPortfolioSnapshot } from "../utils/portfolio-snapshot";

export class AdvisorService {
  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly adviceRepository: AdviceRepository,
  ) {}

  isEnabled(): boolean {
    return isEnvConfigured("ANTHROPIC_API_KEY");
  }

  async *streamAdvice(locale: Locale): AsyncGenerator<PortfolioAdviceDto> {
    if (!this.isEnabled()) {
      yield { status: "error", reason: "disabled" };
      return;
    }

    const overviewResult = await this.portfolioService.getOverview();
    if (overviewResult.status !== "ok") {
      yield { status: "error", reason: "prices-unavailable" };
      return;
    }

    try {
      yield* this.adviceRepository.streamAdvice(toPortfolioSnapshot(overviewResult.overview), locale);
    } catch (error) {
      console.error(error);
      yield { status: "error", reason: "advice-failed" };
    }
  }
}

export const advisorService = new AdvisorService(portfolioService, claudeAdviceRepository);
