import Link from "next/link";

import { TARGET_EDITOR_SEGMENT } from "@/common/constants/site";
import type { Dictionary } from "@/common/i18n/dictionaries";
import type { Locale } from "@/common/i18n/locales";
import { formatCloseDate, formatUsd } from "@/common/utils/format";
import type { PortfolioOverview } from "@/modules/portfolio/dtos/portfolio-overview.dto";
import { totalTradeAmount, tradesOf, tradesOnSide } from "@/modules/portfolio/utils/totals";

import { OnboardingTour } from "./onboarding-tour";

type DashboardHeroProps = {
  overview: PortfolioOverview;
  locale: Locale;
  copy: Dictionary["hero"];
  onboardingCopy: Dictionary["onboarding"];
};

type RebalanceDescriptionInput = Pick<DashboardHeroProps, "overview" | "locale" | "copy">;

function describeRebalance({ overview, locale, copy }: RebalanceDescriptionInput): string {
  const trades = tradesOf(overview.positions);
  if (trades.length === 0) return copy.onTarget;

  const sells = tradesOnSide(trades, "sell");
  return copy.rebalanceSummary({
    soldAmount: formatUsd(totalTradeAmount(sells), locale),
    sellCount: sells.length,
    buyCount: tradesOnSide(trades, "buy").length,
  });
}

export function DashboardHero({ overview, locale, copy, onboardingCopy }: DashboardHeroProps) {
  const pricesLabel = overview.pricedAt ? copy.closeOf(formatCloseDate(overview.pricedAt, locale)) : copy.samplePrices;

  return (
    <section id="portfolio-hero" className="section-rails px-4 pt-16 pb-12 sm:px-10 sm:pt-28">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="inline-flex h-6 items-center gap-2 bg-track px-2 text-ui font-medium text-muted">
          <span aria-hidden className="size-2.5 bg-faint" />
          {pricesLabel}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link id="edit-target" href={`/${locale}/${TARGET_EDITOR_SEGMENT}`} className="button-primary">
            {copy.editTarget}
          </Link>
          <OnboardingTour copy={onboardingCopy} />
        </div>
      </div>
      <div className="mt-4 flex items-stretch">
        <h1 className="pr-6 text-5xl font-medium tracking-tight sm:text-hero">{copy.title}</h1>
        <div aria-hidden className="dot-matrix hidden flex-1 sm:block" />
      </div>
      <div className="flex items-end gap-6">
        <div aria-hidden className="dot-matrix hidden h-40 flex-1 lg:block" />
        <div className="flex max-w-xl flex-col gap-4 pt-6 text-base leading-relaxed text-pretty text-muted">
          <p>{copy.introduction}</p>
          <p>
            <span className="font-medium text-ink tabular-nums">
              {copy.totalValue(formatUsd(overview.totalValue, locale))}.
            </span>{" "}
            {describeRebalance({ overview, locale, copy })}
          </p>
        </div>
      </div>
    </section>
  );
}
