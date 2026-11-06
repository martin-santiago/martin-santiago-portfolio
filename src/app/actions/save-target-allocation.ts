"use server";

import { redirect } from "next/navigation";

import { resolveLocale } from "@/common/i18n/locales";
import type { SaveTargetAllocationDto } from "@/modules/portfolio/dtos/save-target-allocation.dto";
import { portfolioService } from "@/modules/portfolio/services/portfolio.service";
import { readTargetAllocationForm } from "@/modules/portfolio/utils/target-allocation-input";

export async function saveTargetAllocation(
  requestedLocale: string,
  _previousResult: SaveTargetAllocationDto | null,
  formData: FormData,
): Promise<SaveTargetAllocationDto> {
  const targetAllocation = readTargetAllocationForm(formData);
  const isSaved = targetAllocation !== null && (await portfolioService.saveTargetAllocation(targetAllocation));
  if (!isSaved) return { status: "invalid" };

  redirect(`/${resolveLocale(requestedLocale)}`);
}
