import "server-only";

import { PORTFOLIO_SEED } from "../constants/portfolio-seed";
import type { PortfolioRepository } from "./portfolio.repository";

export const seedPortfolioRepository: PortfolioRepository = {
  async getPositions() {
    return PORTFOLIO_SEED;
  },
};
