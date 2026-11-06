import type { Trade } from "@/modules/portfolio/entities/trade";

export type OrderLabels = {
  buy: string;
  sell: string;
  sellAll: string;
};

export function describeOrder(trade: Trade, labels: OrderLabels): string {
  if (trade.side === "buy") return labels.buy;
  return trade.closesPosition ? labels.sellAll : labels.sell;
}
