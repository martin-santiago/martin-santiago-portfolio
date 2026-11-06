import type { AdviceStreamEvent } from "../entities/portfolio-advice";

export type AdviceFailureReason = "disabled" | "prices-unavailable" | "advice-failed";

export type PortfolioAdviceDto = AdviceStreamEvent | { status: "error"; reason: AdviceFailureReason };
