import "server-only";

import { SAMPLE_PRICES } from "../constants/sample-prices";
import type { StockPriceRepository } from "./stock-price.repository";

export const sampleStockPriceRepository: StockPriceRepository = {
  async getLastPrices(symbols) {
    const isSampled = (symbol: string) => symbol in SAMPLE_PRICES;

    return {
      source: "sample",
      prices: symbols.filter(isSampled).map((symbol) => ({ symbol, price: SAMPLE_PRICES[symbol], pricedAt: null })),
      unavailableSymbols: symbols.filter((symbol) => !isSampled(symbol)),
    };
  },
};
