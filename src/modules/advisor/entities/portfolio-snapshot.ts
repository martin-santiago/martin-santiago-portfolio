export type SnapshotOrder = "buy" | "sell" | "sell-all" | "none";

export type PositionSnapshot = {
  symbol: string;
  name: string;
  currentPercentage: number;
  targetPercentage: number;
  order: SnapshotOrder;
};

export type PortfolioSnapshot = {
  positions: PositionSnapshot[];
};
