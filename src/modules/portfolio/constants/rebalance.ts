export const FULL_ALLOCATION_PERCENTAGE = 100;

// Absorbs float rounding only: a looser tolerance accepts targets like 99.99% and leaves money unspent.
export const ALLOCATION_TOLERANCE_PERCENTAGE = 1e-9;

// ponytail: float math is fine for an advisory plan; move to a decimal type before executing real orders.
export const MIN_TRADE_VALUE = 0.01;
