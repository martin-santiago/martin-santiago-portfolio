import type { TargetAllocation } from "../entities/target-allocation";

export type TargetAllocationRepository = {
  getCustomAllocation(): Promise<TargetAllocation | null>;
  saveCustomAllocation(targetAllocation: TargetAllocation): Promise<void>;
  clearCustomAllocation(): Promise<void>;
};
