import type { Dictionary } from "@/common/i18n/dictionaries";
import type { Locale } from "@/common/i18n/locales";
import type { PositionOverview } from "@/modules/portfolio/dtos/portfolio-overview.dto";

import { CalculationTable } from "./calculation-table";
import { CalculationWalkthrough } from "./calculation-walkthrough";
import { DashboardSection } from "./dashboard-section";

type CalculationSectionProps = {
  positions: PositionOverview[];
  totalValue: number;
  colorClassBySymbol: Record<string, string>;
  locale: Locale;
  copy: Dictionary["calculation"];
  orderCopy: Dictionary["orders"];
};

export function CalculationSection({
  positions,
  totalValue,
  colorClassBySymbol,
  locale,
  copy,
  orderCopy,
}: CalculationSectionProps) {
  const { buy, sell, sellAll, shareUnit } = orderCopy;

  return (
    <DashboardSection headingId="calculation-heading" title={copy.title} subtitle={copy.subtitle}>
      <CalculationWalkthrough
        positions={positions}
        totalValue={totalValue}
        colorClassBySymbol={colorClassBySymbol}
        locale={locale}
        copy={copy}
        orderLabels={{ buy, sell, sellAll, shareUnit }}
      />
      <div aria-hidden className="dot-matrix my-8 h-3" />
      <CalculationTable
        positions={positions}
        colorClassBySymbol={colorClassBySymbol}
        locale={locale}
        copy={copy}
        orderCopy={orderCopy}
      />
    </DashboardSection>
  );
}
