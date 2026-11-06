export type PriceSource = "marketstack" | "sample" | "sample-fallback";

export type StockPrice = {
  symbol: string;
  price: number;
  pricedAt: string | null;
};
