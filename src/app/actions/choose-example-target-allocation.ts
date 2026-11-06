"use server";

import { redirect } from "next/navigation";

import { resolveLocale } from "@/common/i18n/locales";
import { portfolioService } from "@/modules/portfolio/services/portfolio.service";

export async function chooseExampleTargetAllocation(requestedLocale: string): Promise<void> {
  await portfolioService.chooseExampleAllocation();
  redirect(`/${resolveLocale(requestedLocale)}`);
}
