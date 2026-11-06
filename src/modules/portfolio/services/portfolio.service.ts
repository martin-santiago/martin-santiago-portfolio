import "server-only";

import { isEnvConfigured } from "@/common/utils/env";
import { MARKETSTACK_API_KEY_ENV } from "@/modules/market-data/constants/marketstack";
import { withSampleFallback } from "@/modules/market-data/repositories/fallback-stock-price.repository";
import { marketstackStockPriceRepository } from "@/modules/market-data/repositories/marketstack-stock-price.repository";
import { sampleStockPriceRepository } from "@/modules/market-data/repositories/sample-stock-price.repository";
import type { StockPriceRepository } from "@/modules/market-data/repositories/stock-price.repository";

import type { PortfolioOverviewDto } from "../dtos/portfolio-overview.dto";
import type { TargetAllocationFormDto } from "../dtos/target-allocation-form.dto";
import type { PortfolioPosition } from "../entities/portfolio-position";
import type { TargetAllocation } from "../entities/target-allocation";
import { cookieTargetAllocationRepository } from "../repositories/cookie-target-allocation.repository";
import type { PortfolioRepository } from "../repositories/portfolio.repository";
import { seedPortfolioRepository } from "../repositories/seed-portfolio.repository";
import type { TargetAllocationRepository } from "../repositories/target-allocation.repository";
import { buildPortfolio, pricePositions, toPortfolioOverview } from "../utils/portfolio-overview";
import { applyTargetAllocation } from "../utils/target-allocation";
import { isValidAllocation } from "../utils/target-allocation-input";

export class PortfolioService {
  constructor(
    private readonly portfolioRepository: PortfolioRepository,
    private readonly stockPriceRepository: StockPriceRepository,
    private readonly targetAllocationRepository: TargetAllocationRepository,
  ) {}

  async getOverview(): Promise<PortfolioOverviewDto> {
    const examplePositions = await this.portfolioRepository.getPositions();
    const positions = applyTargetAllocation(examplePositions, await this.getValidCustomAllocation(examplePositions));
    const priceLookup = await this.stockPriceRepository.getLastPrices(positions.map(({ symbol }) => symbol));

    if (priceLookup.unavailableSymbols.length > 0) {
      return { status: "prices-unavailable", unavailableSymbols: priceLookup.unavailableSymbols };
    }

    const pricedPositions = pricePositions(positions, priceLookup.prices);
    const portfolio = buildPortfolio(pricedPositions);
    const stocks = pricedPositions.map(({ stock }) => stock);
    return { status: "ok", overview: toPortfolioOverview({ portfolio, stocks, priceLookup }) };
  }

  async getTargetAllocationForm(): Promise<TargetAllocationFormDto> {
    const examplePositions = await this.portfolioRepository.getPositions();
    const customAllocation = await this.getValidCustomAllocation(examplePositions);

    return {
      stocks: examplePositions.map(({ symbol, name, targetPercentage }) => ({
        symbol,
        name,
        exampleTargetPercentage: targetPercentage,
        targetPercentage: customAllocation ? (customAllocation[symbol] ?? 0) : targetPercentage,
      })),
    };
  }

  async saveTargetAllocation(targetAllocation: TargetAllocation): Promise<boolean> {
    const knownSymbols = (await this.portfolioRepository.getPositions()).map(({ symbol }) => symbol);
    if (!isValidAllocation(targetAllocation, knownSymbols)) return false;

    const completeAllocation = Object.fromEntries(knownSymbols.map((symbol) => [symbol, targetAllocation[symbol] ?? 0]));
    await this.targetAllocationRepository.saveCustomAllocation(completeAllocation);
    return true;
  }

  async chooseExampleAllocation(): Promise<void> {
    await this.targetAllocationRepository.clearCustomAllocation();
  }

  private async getValidCustomAllocation(positions: PortfolioPosition[]): Promise<TargetAllocation | null> {
    const customAllocation = await this.targetAllocationRepository.getCustomAllocation();
    const knownSymbols = positions.map(({ symbol }) => symbol);
    return customAllocation && isValidAllocation(customAllocation, knownSymbols) ? customAllocation : null;
  }
}

const stockPriceRepository = isEnvConfigured(MARKETSTACK_API_KEY_ENV)
  ? withSampleFallback(marketstackStockPriceRepository)
  : sampleStockPriceRepository;

export const portfolioService = new PortfolioService(
  seedPortfolioRepository,
  stockPriceRepository,
  cookieTargetAllocationRepository,
);
