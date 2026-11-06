import { connection } from "next/server";

import type { Dictionary } from "@/common/i18n/dictionaries";
import type { Locale } from "@/common/i18n/locales";
import { assignStockColors } from "@/common/utils/stock-colors";
import { advisorService } from "@/modules/advisor/services/advisor.service";
import { portfolioSnapshotKey } from "@/modules/advisor/utils/portfolio-snapshot";
import { portfolioService } from "@/modules/portfolio/services/portfolio.service";

import { AdvicePanel } from "./advice-panel";
import { AllocationSection } from "./allocation-section";
import { CalculationSection } from "./calculation-section";
import { DashboardFooter } from "./dashboard-footer";
import { DashboardHero } from "./dashboard-hero";
import { OrdersSection } from "./orders-section";
import { PositionsSection } from "./positions-section";
import { PricesUnavailable } from "./prices-unavailable";

type PortfolioDashboardProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export async function PortfolioDashboard({ locale, dictionary }: PortfolioDashboardProps) {
  await connection();
  const overviewResult = await portfolioService.getOverview();

  if (overviewResult.status === "prices-unavailable") {
    return (
      <PricesUnavailable
        unavailableSymbols={overviewResult.unavailableSymbols}
        locale={locale}
        copy={dictionary.pricesUnavailable}
      />
    );
  }

  const { overview } = overviewResult;
  const { positions } = overview;
  const colorClassBySymbol = assignStockColors(positions.map(({ symbol }) => symbol));
  const sectionProps = { positions, colorClassBySymbol, locale };

  return (
    <>
      <DashboardHero overview={overview} locale={locale} copy={dictionary.hero} onboardingCopy={dictionary.onboarding} />
      <AllocationSection {...sectionProps} copy={dictionary.allocation} infoCopy={dictionary.info} />
      <CalculationSection
        {...sectionProps}
        totalValue={overview.totalValue}
        copy={dictionary.calculation}
        orderCopy={dictionary.orders}
      />
      <OrdersSection {...sectionProps} copy={dictionary.orders} infoCopy={dictionary.info} />
      <PositionsSection {...sectionProps} copy={dictionary.positions} infoCopy={dictionary.info} />
      {/* Next keeps visited pages mounted (Activity), so the key drops advice given for a different portfolio. */}
      <AdvicePanel
        key={portfolioSnapshotKey(overview)}
        isAdvisorEnabled={advisorService.isEnabled()}
        colorClassBySymbol={colorClassBySymbol}
        locale={locale}
        copy={dictionary.advice}
      />
      <DashboardFooter
        note={dictionary.footer[overview.priceSource]}
      />
    </>
  );
}
