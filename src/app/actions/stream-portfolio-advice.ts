"use server";

import { resolveLocale } from "@/common/i18n/locales";
import type { PortfolioAdviceDto } from "@/modules/advisor/dtos/portfolio-advice.dto";
import { advisorService } from "@/modules/advisor/services/advisor.service";

export async function streamPortfolioAdvice(requestedLocale: string): Promise<AsyncIterable<PortfolioAdviceDto>> {
  return advisorService.streamAdvice(resolveLocale(requestedLocale));
}
