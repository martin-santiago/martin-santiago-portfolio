import { describe, expect, it } from "vitest";

import { totalTradeAmount, tradesOnSide } from "../utils/totals";
import { Portfolio } from "./portfolio";
import { Stock } from "./stock";

const stockAt = (symbol: string, price: number) => new Stock(symbol, symbol, price);

describe("Stock", () => {
  it("returns its last available price", () => {
    expect(stockAt("META", 612.5).currentPrice()).toBe(612.5);
  });

  it("rejects a price that is not positive", () => {
    expect(() => stockAt("META", 0)).toThrow();
    expect(() => stockAt("META", -10)).toThrow();
    expect(() => stockAt("META", Number.NaN)).toThrow();
  });
});

describe("Portfolio", () => {
  const meta = stockAt("META", 100);
  const nvda = stockAt("NVDA", 50);

  it("adds up the market value of its holdings", () => {
    const portfolio = new Portfolio(
      [{ stock: meta, shares: 7 }, { stock: nvda, shares: 6 }],
      [{ stock: meta, targetPercentage: 50 }, { stock: nvda, targetPercentage: 50 }],
    );

    expect(portfolio.totalValue()).toBe(1000);
    expect(portfolio.currentPercentage("META")).toBe(70);
    expect(portfolio.targetPercentage("META")).toBe(50);
    expect(portfolio.targetValue("META")).toBe(500);
  });

  it("rejects an allocation that does not add up to 100%", () => {
    expect(
      () => new Portfolio([], [{ stock: meta, targetPercentage: 60 }, { stock: nvda, targetPercentage: 30 }]),
    ).toThrow(/100%/);
  });

  it("rejects duplicated symbols", () => {
    expect(
      () => new Portfolio([{ stock: meta, shares: 1 }, { stock: meta, shares: 2 }], [{ stock: meta, targetPercentage: 100 }]),
    ).toThrow(/META/);
  });

  it("rejects negative shares", () => {
    expect(() => new Portfolio([{ stock: meta, shares: -1 }], [{ stock: meta, targetPercentage: 100 }])).toThrow(/META/);
  });
});

describe("Portfolio.rebalance", () => {
  const meta = stockAt("META", 100);
  const nvda = stockAt("NVDA", 50);
  const rblx = stockAt("RBLX", 20);
  const unity = stockAt("U", 10);

  it("suggests nothing when the portfolio already matches its allocation", () => {
    const portfolio = new Portfolio(
      [{ stock: meta, shares: 5 }, { stock: nvda, shares: 10 }],
      [{ stock: meta, targetPercentage: 50 }, { stock: nvda, targetPercentage: 50 }],
    );

    expect(portfolio.rebalance()).toEqual([]);
  });

  it("sells the overweight stock and buys the underweight one, sells first", () => {
    const portfolio = new Portfolio(
      [{ stock: nvda, shares: 6 }, { stock: meta, shares: 7 }],
      [{ stock: meta, targetPercentage: 50 }, { stock: nvda, targetPercentage: 50 }],
    );

    expect(portfolio.rebalance()).toEqual([
      { symbol: "META", side: "sell", shares: 2, amount: 200, closesPosition: false },
      { symbol: "NVDA", side: "buy", shares: 4, amount: 200, closesPosition: false },
    ]);
  });

  it("buys an allocated stock the portfolio does not hold yet", () => {
    const portfolio = new Portfolio(
      [{ stock: meta, shares: 10 }],
      [{ stock: meta, targetPercentage: 60 }, { stock: rblx, targetPercentage: 40 }],
    );

    expect(portfolio.rebalance()).toEqual([
      { symbol: "META", side: "sell", shares: 4, amount: 400, closesPosition: false },
      { symbol: "RBLX", side: "buy", shares: 20, amount: 400, closesPosition: false },
    ]);
  });

  it("sells every share of a holding that is not in the allocation", () => {
    const portfolio = new Portfolio(
      [{ stock: meta, shares: 5 }, { stock: unity, shares: 50 }],
      [{ stock: meta, targetPercentage: 100 }],
    );

    expect(portfolio.rebalance()).toEqual([
      { symbol: "U", side: "sell", shares: 50, amount: 500, closesPosition: true },
      { symbol: "META", side: "buy", shares: 5, amount: 500, closesPosition: false },
    ]);
  });

  it("produces a self-financing plan where buys match sells", () => {
    const portfolio = new Portfolio(
      [
        { stock: stockAt("META", 612.37), shares: 10 },
        { stock: stockAt("NVDA", 181.09), shares: 30 },
        { stock: stockAt("NTDOY", 19.83), shares: 120 },
        { stock: stockAt("U", 41.12), shares: 40 },
      ],
      [
        { stock: stockAt("META", 612.37), targetPercentage: 33.3 },
        { stock: stockAt("NVDA", 181.09), targetPercentage: 33.3 },
        { stock: stockAt("NTDOY", 19.83), targetPercentage: 25.4 },
        { stock: stockAt("RBLX", 118.4), targetPercentage: 8 },
      ],
    );

    const trades = portfolio.rebalance();

    expect(trades.length).toBeGreaterThan(0);
    expect(totalTradeAmount(tradesOnSide(trades, "buy"))).toBeCloseTo(totalTradeAmount(tradesOnSide(trades, "sell")), 6);
  });

  it("ignores gaps smaller than a cent", () => {
    const portfolio = new Portfolio(
      [{ stock: meta, shares: 5 }, { stock: stockAt("GOOGL", 100), shares: 5.00001 }],
      [{ stock: meta, targetPercentage: 50 }, { stock: stockAt("GOOGL", 100), targetPercentage: 50 }],
    );

    expect(portfolio.rebalance()).toEqual([]);
  });

  it("suggests nothing for an empty portfolio", () => {
    const portfolio = new Portfolio([], [{ stock: meta, targetPercentage: 100 }]);

    expect(portfolio.rebalance()).toEqual([]);
  });
});
