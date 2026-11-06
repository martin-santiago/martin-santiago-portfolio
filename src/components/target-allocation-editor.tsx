import type { Dictionary } from "@/common/i18n/dictionaries";
import type { Locale } from "@/common/i18n/locales";
import { assignStockColors } from "@/common/utils/stock-colors";
import { portfolioService } from "@/modules/portfolio/services/portfolio.service";
import { targetAllocationKey } from "@/modules/portfolio/utils/target-allocation";

import { TargetAllocationForm } from "./target-allocation-form";

type TargetAllocationEditorProps = {
  locale: Locale;
  copy: Dictionary["targetEditor"];
  infoCopy: Dictionary["info"];
};

export async function TargetAllocationEditor({ locale, copy, infoCopy }: TargetAllocationEditorProps) {
  const { stocks } = await portfolioService.getTargetAllocationForm();
  const colorClassBySymbol = assignStockColors(stocks.map(({ symbol }) => symbol));

  return (
    <section className="section-rails px-4 pt-16 pb-16 sm:px-10 sm:pt-28">
      <div className="flex items-stretch">
        <h1 className="pr-6 text-5xl font-medium tracking-tight sm:text-hero">{copy.title}</h1>
        <div aria-hidden className="dot-matrix hidden flex-1 sm:block" />
      </div>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-pretty text-muted">{copy.lead}</p>
      {/* Next keeps visited pages mounted (Activity), so the key resets the inputs when the saved target changes. */}
      <TargetAllocationForm
        key={targetAllocationKey(stocks)}
        stocks={stocks}
        colorClassBySymbol={colorClassBySymbol}
        locale={locale}
        copy={copy}
        infoCopy={infoCopy}
      />
    </section>
  );
}
