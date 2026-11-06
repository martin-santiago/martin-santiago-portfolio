export type TargetAllocationStock = {
  symbol: string;
  name: string;
  exampleTargetPercentage: number;
  targetPercentage: number;
};

export type TargetAllocationFormDto = {
  stocks: TargetAllocationStock[];
};
