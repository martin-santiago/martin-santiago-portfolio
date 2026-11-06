import "server-only";

import { z } from "zod";

import { roundToFractionDigits } from "@/common/utils/rounding";

import { MAX_TARGET_PERCENTAGE, TARGET_FIELD_PREFIX, TARGET_PERCENTAGE_FRACTION_DIGITS } from "../constants/target-allocation";
import type { TargetAllocation } from "../entities/target-allocation";
import { isFullAllocation } from "./target-allocation";
import { sum } from "./totals";

const targetPercentageSchema = z.coerce
  .number()
  .min(0)
  .max(MAX_TARGET_PERCENTAGE)
  .refine((percentage) => roundToFractionDigits(percentage, TARGET_PERCENTAGE_FRACTION_DIGITS) === percentage);

export function isValidAllocation(targetAllocation: TargetAllocation, knownSymbols: string[]): boolean {
  const entries = Object.entries(targetAllocation);
  const hasOnlyKnownSymbols = entries.every(([symbol]) => knownSymbols.includes(symbol));
  const hasValidPercentages = entries.every(([, percentage]) => targetPercentageSchema.safeParse(percentage).success);
  return hasOnlyKnownSymbols && hasValidPercentages && isFullAllocation(sum(entries.map(([, percentage]) => percentage)));
}

export function readTargetAllocationForm(formData: FormData): TargetAllocation | null {
  const targetAllocation: TargetAllocation = {};

  for (const [fieldName, fieldValue] of formData.entries()) {
    if (!fieldName.startsWith(TARGET_FIELD_PREFIX)) continue;
    const parsedPercentage = targetPercentageSchema.safeParse(fieldValue);
    if (!parsedPercentage.success) return null;
    targetAllocation[fieldName.slice(TARGET_FIELD_PREFIX.length)] = parsedPercentage.data;
  }

  return targetAllocation;
}
