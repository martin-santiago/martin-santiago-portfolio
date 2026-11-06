import "server-only";

import { sampleStockPriceRepository } from "./sample-stock-price.repository";
import type { StockPriceRepository } from "./stock-price.repository";

export function withSampleFallback(primaryRepository: StockPriceRepository): StockPriceRepository {
  return {
    async getLastPrices(symbols) {
      const priceLookup = await primaryRepository.getLastPrices(symbols);
      if (priceLookup.unavailableSymbols.length === 0) return priceLookup;

      const sampleLookup = await sampleStockPriceRepository.getLastPrices(symbols);
      return { ...sampleLookup, source: "sample-fallback" };
    },
  };
}
