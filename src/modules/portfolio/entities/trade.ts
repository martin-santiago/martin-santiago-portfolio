export type TradeSide = "buy" | "sell";

export type Trade = {
  symbol: string;
  side: TradeSide;
  shares: number;
  amount: number;
  closesPosition: boolean;
};
