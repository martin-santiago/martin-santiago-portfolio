import "server-only";

import { cookies } from "next/headers";
import { z } from "zod";

import { TARGET_ALLOCATION_COOKIE, TARGET_ALLOCATION_COOKIE_MAX_AGE_SECONDS } from "../constants/target-allocation";
import type { TargetAllocation } from "../entities/target-allocation";
import type { TargetAllocationRepository } from "./target-allocation.repository";

const storedAllocationSchema = z.record(z.string(), z.number());

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  maxAge: TARGET_ALLOCATION_COOKIE_MAX_AGE_SECONDS,
} as const;

function parseStoredAllocation(storedValue: string): TargetAllocation | null {
  try {
    const parsedAllocation = storedAllocationSchema.safeParse(JSON.parse(storedValue));
    return parsedAllocation.success ? parsedAllocation.data : null;
  } catch {
    return null;
  }
}

export const cookieTargetAllocationRepository: TargetAllocationRepository = {
  async getCustomAllocation() {
    const storedValue = (await cookies()).get(TARGET_ALLOCATION_COOKIE)?.value;
    return storedValue ? parseStoredAllocation(storedValue) : null;
  },

  async saveCustomAllocation(targetAllocation) {
    (await cookies()).set(TARGET_ALLOCATION_COOKIE, JSON.stringify(targetAllocation), COOKIE_OPTIONS);
  },

  async clearCustomAllocation() {
    (await cookies()).delete(TARGET_ALLOCATION_COOKIE);
  },
};
