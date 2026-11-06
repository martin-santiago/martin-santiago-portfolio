import "server-only";

import { cacheLife } from "next/cache";
import { z } from "zod";

import { getRequiredEnv } from "@/common/utils/env";

import {
  MARKETSTACK_API_KEY_ENV,
  MARKETSTACK_LATEST_CLOSES_URL,
  MARKETSTACK_TIMEOUT_MS,
} from "../constants/marketstack";
import type { StockPrice } from "../entities/stock-price";
import type { StockPriceLookup, StockPriceRepository } from "./stock-price.repository";

const latestClosesSchema = z.object({
  data: z.array(z.object({ symbol: z.string(), close: z.number().nullable(), date: z.string() })),
});

async function requestLatestCloses(symbols: string[]): Promise<StockPrice[]> {
  const latestClosesUrl = new URL(MARKETSTACK_LATEST_CLOSES_URL);
  latestClosesUrl.searchParams.set("access_key", getRequiredEnv(MARKETSTACK_API_KEY_ENV));
  latestClosesUrl.searchParams.set("symbols", symbols.join(","));

  const response = await fetch(latestClosesUrl, { signal: AbortSignal.timeout(MARKETSTACK_TIMEOUT_MS) });
  if (!response.ok) throw new Error(`Marketstack responded ${response.status}`);

  const { data: latestCloses } = latestClosesSchema.parse(await response.json());
  return latestCloses.flatMap(({ symbol, close, date }) =>
    close && close > 0 ? [{ symbol, price: close, pricedAt: new Date(date).toISOString() }] : [],
  );
}

async function getLastPrices(symbols: string[]): Promise<StockPriceLookup> {
  "use cache: remote";
  const prices = await requestLatestCloses(symbols).catch((error: unknown) => {
    console.error(error);
    return [];
  });
  const pricedSymbols = new Set(prices.map(({ symbol }) => symbol));
  const unavailableSymbols = symbols.filter((symbol) => !pricedSymbols.has(symbol));
  // ponytail: the free plan allows 100 requests a month (each deploy starts a new cache). A complete answer is kept a day;
  // a failed or partial one only an hour, so it neither sticks for a day nor costs a request per visit.
  if (unavailableSymbols.length === 0) cacheLife("days");
  else cacheLife("hours");
  return { source: "marketstack", prices, unavailableSymbols };
}

export const marketstackStockPriceRepository: StockPriceRepository = { getLastPrices };
