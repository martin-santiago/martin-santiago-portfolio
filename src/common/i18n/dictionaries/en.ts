import type { Dictionary } from "./es";

const overweightCompanies = (count: number) =>
  count === 1 ? "the company that weighs too much" : `the ${count} companies that weigh too much`;

const underweightCompanies = (count: number) =>
  count === 1 ? "the one that weighs too little" : `the ${count} that weigh too little`;

export const en: Dictionary = {
  metadata: {
    title: "Martín Santiago Portfolio",
    description: "See which stocks to buy and sell to get a portfolio back to its target allocation.",
  },
  site: {
    name: "Martín Santiago Portfolio",
    localeSwitcherLabel: "Language",
    repository: "GitHub",
  },
  hero: {
    title: "Hi, I'm Martín",
    introduction:
      "I'm Martín Pérez, an Industrial Engineer in Computer Science from PUC, into music, video games and finance. My portfolio mixes big tech with the companies behind the games I enjoy most. I built this site so AI can recommend what to sell and buy to keep the mix I planned.",
    totalValue: (amount) => `Total value ${amount}`,
    closeOf: (closeDate) => `Close of ${closeDate}`,
    editTarget: "Edit target",
    samplePrices: "Sample prices",
    onTarget: "Today my portfolio matches the mix I planned.",
    rebalanceSummary: ({ soldAmount, sellCount, buyCount }) =>
      `Today my portfolio doesn't match the split I planned. To fix it, I should sell ${soldAmount} of ${overweightCompanies(sellCount)} and use that same money to buy ${underweightCompanies(buyCount)}. No money comes in or out: only the split changes.`,
  },
  info: {
    label: "What it means",
    shares: "How many shares you own. In this demo they come fixed from the example portfolio; a real app would read them from your broker account.",
    current:
      "How much the stock weighs in your portfolio today: shares × closing price, divided by the total value. E.g. 10 shares × $600 = $6,000 of $30,000 → 20%. It moves on its own as prices change.",
    target: "The weight you want for the stock. Set it in “Edit target” or keep the example. All targets add up to 100%.",
    drift:
      "Current minus target, in percentage points (pp). Positive in red: too much, sell. Negative in green: too little, buy.",
    example: "The example split that ships with the app: 60% big tech and 40% video games.",
    yourTarget: "The percentage you want in each stock. Use 0% to leave it out. The total must add up to 100%.",
    allocationSection:
      "Compares how your money is split today (Current bar) with the split you planned (Target bar). Each color is a stock and its width is its share of the total. When the blocks don't line up between the two bars, the portfolio has drifted, and that's what the orders fix.",
    ordersSection:
      "The rebalance result. For each stock, its current value is compared with its target value (total value × target %) and the difference is bought or sold, fractional shares allowed. What you sell pays exactly for what you buy, so the total stays the same. Largest orders first.",
    positionsSection:
      "The per-stock detail: closing price, shares you own, what they're worth and their current weight against the target. Drift says how far off it is in percentage points, and the track draws it: the solid marker is the current weight, the hollow one the target and the colored stretch the distance.",
  },
  targetEditor: {
    title: "Set your target",
    lead: "How do you want to split your money? Enter the percentage you want in each stock; they must add up to 100%. Once saved, the rebalance plan is recalculated with your target.",
    stock: "Stock",
    example: "Example",
    target: "Your target",
    total: "Total",
    complete: "Adds up to 100%, all set.",
    missing: "{percentage} left to reach 100%.",
    excess: "{percentage} over: lower a value until it reaches 100%.",
    save: "Use this target",
    saving: "Saving…",
    useExample: "Use the example",
    invalid: "The target must add up to 100% and every value must be between 0 and 100.",
  },
  allocation: {
    title: "Allocation.",
    subtitle: "How the money is split today against how it should be.",
    current: "Current",
    target: "Target",
  },
  calculation: {
    title: "Balance. How it's calculated.",
    subtitle: "The four steps the rebalance follows for every stock.",
    selectorLabel: "Show the calculation for",
    totalStep: "Total value",
    totalStepDescription: "Shares × closing price, summed across every company.",
    totalFormula: "Σ shares × price",
    targetStep: "Target value",
    targetStepDescription: "What this stock should be worth: total value × its target %.",
    gapStep: "Gap",
    gapStepDescription: "Target value minus current value (shares × price).",
    sharesStep: "Shares to trade",
    sharesStepDescription: "The gap divided by the stock's price.",
    excess: "too much, sell",
    shortfall: "too little, buy",
    onTarget: "on target, no order",
    tableCaption: "Each stock with its current value, target value, gap and the resulting order",
    stock: "Stock",
    currentValue: "Current value",
    targetValue: "Target value",
    gap: "Gap",
    price: "Price",
    order: "Order",
    sold: "You sell",
    bought: "You buy",
  },
  orders: {
    title: "Orders.",
    subtitle: "What to sell and buy to get back on target.",
    buy: "Buy",
    sell: "Sell",
    sellAll: "Sell all",
    shareUnit: "sh",
    empty: "No pending orders.",
    sellGroup: "Sell",
    buyGroup: "Buy",
    sellGroupHint: (count) => (count === 1 ? "1 company weighs too much" : `${count} companies weigh too much`),
    buyGroupHint: (count) => (count === 1 ? "1 company weighs too little" : `${count} companies weigh too little`),
  },
  positions: {
    title: "Positions.",
    subtitle: "Price, shares and how far each stock is from its target.",
    caption: "Each stock with its price, shares, value and current allocation against its target",
    stock: "Stock",
    price: "Price",
    shares: "Shares",
    value: "Value",
    current: "Current",
    target: "Target",
    drift: "Drift",
  },
  advice: {
    title: "Advice from Claude.",
    subtitle: "A second opinion on every order.",
    request: "Get advice",
    requesting: "Getting advice…",
    agreesWithOrder: "Agrees with the order",
    disagreesWithOrder: "Disagrees with the order",
    stances: { add: "Add", hold: "Hold", trim: "Trim" },
    errors: {
      disabled: "Advice is off here. Set ANTHROPIC_API_KEY to turn it on.",
      "advice-failed": "Couldn't get advice right now. Try again in a minute.",
      "prices-unavailable": "Prices are unavailable, so there is nothing to review yet.",
    },
  },
  onboarding: {
    restart: "Show tour",
    skip: "Skip tour",
    next: "Next",
    previous: "Back",
    done: "Done",
    progress: "{{current}} of {{total}}",
    steps: {
      welcome: {
        title: "Welcome to my portfolio",
        description: "This is where I track my investments and decide what to adjust. Here's how to read it, step by step.",
      },
      allocation: {
        title: "How it's split",
        description: "Each color is a stock. The top bar is how the money is split today; the bottom one is the mix I aim for.",
      },
      calculation: {
        title: "How it's calculated",
        description:
          "Pick a stock and follow the four rebalance steps with its real numbers: total value, target value, gap and shares to trade. Below, the same math for every stock.",
      },
      orders: {
        title: "What to sell and buy",
        description: "Sells on one side, buys on the other, each side largest first. What I sell pays exactly for what I buy.",
      },
      drift: {
        title: "How far each stock is",
        description:
          "Drift is the current weight minus the target. Example: 20% now with a 15% target gives +5 pp in red: too much, sell. 5% with a 10% target gives -5 pp in green: too little, buy.",
      },
      advice: {
        title: "A second opinion",
        description: "Claude reviews every order and says whether it agrees. It takes a few seconds.",
      },
      target: {
        title: "Try your own target",
        description: "This is the split I chose, but you can set yours: change the percentages and the whole plan is recalculated.",
      },
    },
  },
  footer: {
    marketstack: "Daily closing prices from Marketstack.",
    sample: "Sample prices. Set MARKETSTACK_API_KEY to use real prices.",
    "sample-fallback": "Marketstack isn't returning prices right now, so these are sample prices.",
  },
  pricesUnavailable: {
    heading: (symbols) => `No price for ${symbols}`,
    body: "The rebalance plan needs a current price for every stock. Check that MARKETSTACK_API_KEY is valid, then reload the prices.",
    reload: "Reload prices",
  },
  loading: "Loading prices",
};
