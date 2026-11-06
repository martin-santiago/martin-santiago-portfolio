import type { PortfolioPosition } from "../entities/portfolio-position";

export type PortfolioRepository = {
  getPositions(): Promise<PortfolioPosition[]>;
};
