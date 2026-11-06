import type { Dictionary } from "@/common/i18n/dictionaries";
import type { Locale } from "@/common/i18n/locales";
import type { PositionOverview } from "@/modules/portfolio/dtos/portfolio-overview.dto";

import { DashboardSection } from "./dashboard-section";
import { InfoTip } from "./info-tip";
import { PositionRow } from "./position-row";

type PositionsSectionProps = {
  positions: PositionOverview[];
  colorClassBySymbol: Record<string, string>;
  locale: Locale;
  copy: Dictionary["positions"];
  infoCopy: Dictionary["info"];
};

const HEADER_CELL_CLASSES = "px-4 pb-1 font-medium whitespace-nowrap";

export function PositionsSection({ positions, colorClassBySymbol, locale, copy, infoCopy }: PositionsSectionProps) {
  const scalePercentage = Math.ceil(
    Math.max(...positions.flatMap(({ currentPercentage, targetPercentage }) => [currentPercentage, targetPercentage])),
  );

  return (
    <DashboardSection
      headingId="positions-heading"
      title={copy.title}
      subtitle={copy.subtitle}
      info={<InfoTip id="positions-section-info" label={`${infoCopy.label}: ${copy.title}`} text={infoCopy.positionsSection} />}
    >
      <div className="overflow-x-auto">
        <table id="positions-table" className="w-full min-w-4xl border-separate border-spacing-y-1 text-ui">
          <caption className="sr-only">{copy.caption}</caption>
          <thead className="text-left text-label text-faint uppercase">
            <tr>
              <th scope="col" className={`${HEADER_CELL_CLASSES} whitespace-nowrap`}>{copy.stock}</th>
              <th scope="col" className={`${HEADER_CELL_CLASSES} text-right`}>{copy.price}</th>
              <th scope="col" className={`${HEADER_CELL_CLASSES} text-right`}>
                {copy.shares}
                <InfoTip id="positions-shares-info" label={`${infoCopy.label}: ${copy.shares}`} text={infoCopy.shares} />
              </th>
              <th scope="col" className={`${HEADER_CELL_CLASSES} text-right`}>{copy.value}</th>
              <th scope="col" className={`${HEADER_CELL_CLASSES} text-right`}>
                {copy.current}
                <InfoTip id="positions-current-info" label={`${infoCopy.label}: ${copy.current}`} text={infoCopy.current} />
              </th>
              <th scope="col" className={`${HEADER_CELL_CLASSES} text-right`}>
                {copy.target}
                <InfoTip id="positions-target-info" label={`${infoCopy.label}: ${copy.target}`} text={infoCopy.target} />
              </th>
              <th scope="col" className={`${HEADER_CELL_CLASSES} text-right`}>
                {copy.drift}
                <InfoTip id="positions-drift-info" label={`${infoCopy.label}: ${copy.drift}`} text={infoCopy.drift} />
              </th>
              <th scope="col" className={`${HEADER_CELL_CLASSES} w-1/4`}>
                <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden className="h-3 w-1.5 bg-ink" />
                    {copy.current}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden className="h-3 w-1.5 border border-ink" />
                    {copy.target}
                  </span>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <PositionRow
                key={position.symbol}
                position={position}
                colorClass={colorClassBySymbol[position.symbol]}
                scalePercentage={scalePercentage}
                locale={locale}
              />
            ))}
          </tbody>
        </table>
      </div>
    </DashboardSection>
  );
}
