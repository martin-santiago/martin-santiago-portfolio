import type { Locale } from "@/common/i18n/locales";

import type { AdviceStreamEvent } from "../entities/portfolio-advice";
import type { PortfolioSnapshot } from "../entities/portfolio-snapshot";

export type AdviceRepository = {
  streamAdvice(snapshot: PortfolioSnapshot, locale: Locale): AsyncGenerator<AdviceStreamEvent>;
};
