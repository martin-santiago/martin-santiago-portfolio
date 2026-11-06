import type { PortfolioPosition } from "../entities/portfolio-position";

export const PORTFOLIO_SEED: PortfolioPosition[] = [
  { symbol: "META", name: "Meta Platforms", shares: 10, targetPercentage: 15 },
  { symbol: "GOOGL", name: "Alphabet", shares: 25, targetPercentage: 15 },
  { symbol: "MSFT", name: "Microsoft", shares: 8, targetPercentage: 15 },
  { symbol: "NVDA", name: "NVIDIA", shares: 30, targetPercentage: 15 },
  { symbol: "NTDOY", name: "Nintendo (ADR)", shares: 120, targetPercentage: 10 },
  { symbol: "SONY", name: "Sony Group (ADR)", shares: 60, targetPercentage: 10 },
  { symbol: "TTWO", name: "Take-Two Interactive", shares: 12, targetPercentage: 12 },
  { symbol: "RBLX", name: "Roblox", shares: 0, targetPercentage: 8 },
  { symbol: "U", name: "Unity Software", shares: 40, targetPercentage: 0 },
];
