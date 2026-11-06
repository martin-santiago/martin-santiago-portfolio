export function roundToFractionDigits(value: number, fractionDigits: number): number {
  return Number(value.toFixed(fractionDigits));
}
