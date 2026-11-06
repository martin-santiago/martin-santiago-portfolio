export const ADVICE_STANCES = ["add", "hold", "trim"] as const;

export type AdviceStance = (typeof ADVICE_STANCES)[number];

export type StockRecommendation = {
  symbol: string;
  stance: AdviceStance;
  agreesWithPlan: boolean;
  rationale: string;
};

export type PortfolioAdvice = {
  summary: string;
  recommendations: StockRecommendation[];
};

export type AdviceStreamEvent =
  | { status: "writing"; text: string }
  | { status: "restarted" }
  | { status: "ok"; advice: PortfolioAdvice };
