export class Stock {
  constructor(
    readonly symbol: string,
    readonly name: string,
    private readonly lastPrice: number,
  ) {
    if (!Number.isFinite(lastPrice) || lastPrice <= 0) {
      throw new Error(`Stock ${symbol} needs a positive price, got ${lastPrice}`);
    }
  }

  currentPrice(): number {
    return this.lastPrice;
  }
}
