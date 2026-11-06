import type { Dictionary } from "@/common/i18n/dictionaries";
import type { Locale } from "@/common/i18n/locales";
import { formatPercentage } from "@/common/utils/format";
import type { PositionOverview } from "@/modules/portfolio/dtos/portfolio-overview.dto";

import { AllocationLegend } from "./allocation-legend";
import { AllocationStack } from "./allocation-stack";
import { DashboardSection } from "./dashboard-section";
import { InfoTip } from "./info-tip";

type AllocationSectionProps = {
  positions: PositionOverview[];
  colorClassBySymbol: Record<string, string>;
  locale: Locale;
  copy: Dictionary["allocation"];
  infoCopy: Dictionary["info"];
};

export function AllocationSection({ positions, colorClassBySymbol, locale, copy, infoCopy }: AllocationSectionProps) {
  const segmentsOf = (percentageOf: (position: PositionOverview) => number) =>
    positions.map((position) => ({
      symbol: position.symbol,
      name: position.name,
      percentage: percentageOf(position),
      percentageLabel: formatPercentage(percentageOf(position), locale),
      colorClass: colorClassBySymbol[position.symbol],
    }));

  return (
    <DashboardSection
      headingId="allocation-heading"
      title={copy.title}
      subtitle={copy.subtitle}
      info={<InfoTip id="allocation-section-info" label={`${infoCopy.label}: ${copy.title}`} text={infoCopy.allocationSection} />}
    >
      <div id="allocation-chart" className="flex flex-col gap-3">
        <AllocationStack
          label={copy.current}
          info={<InfoTip id="allocation-current-info" label={`${infoCopy.label}: ${copy.current}`} text={infoCopy.current} />}
          segments={segmentsOf(({ currentPercentage }) => currentPercentage)}
        />
        <AllocationStack
          label={copy.target}
          info={<InfoTip id="allocation-target-info" label={`${infoCopy.label}: ${copy.target}`} text={infoCopy.target} />}
          segments={segmentsOf(({ targetPercentage }) => targetPercentage)}
        />
      </div>
      <div aria-hidden className="dot-matrix my-8 h-3" />
      <AllocationLegend positions={positions} colorClassBySymbol={colorClassBySymbol} locale={locale} />
    </DashboardSection>
  );
}
