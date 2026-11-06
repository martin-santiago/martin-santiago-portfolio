import type { Dictionary } from "@/common/i18n/dictionaries";
import { formatRank } from "@/common/utils/format";
import type { AdviceStance, PortfolioAdvice } from "@/modules/advisor/entities/portfolio-advice";

type AdviceListProps = {
  advice: PortfolioAdvice;
  colorClassBySymbol: Record<string, string>;
  copy: Dictionary["advice"];
};

const STANCE_TEXT_CLASSES: Record<AdviceStance, string> = {
  add: "text-buy",
  hold: "text-muted",
  trim: "text-sell",
};

export function AdviceList({ advice, colorClassBySymbol, copy }: AdviceListProps) {
  return (
    <div className="flex flex-col gap-8">
      <p className="max-w-3xl text-base leading-relaxed text-pretty">{advice.summary}</p>
      <ol className="grid gap-3 lg:grid-cols-2">
        {advice.recommendations.map((recommendation, index) => (
          <li key={recommendation.symbol} className="raised flex flex-col gap-3 border border-line bg-surface p-4 text-ui">
            <div className="flex items-center gap-3">
              <span className="text-faint tabular-nums">{formatRank(index + 1)}</span>
              <span aria-hidden className={`size-2.5 shrink-0 ${colorClassBySymbol[recommendation.symbol] ?? "bg-faint"}`} />
              <span className="font-semibold">{recommendation.symbol}</span>
              <span className={`font-medium ${STANCE_TEXT_CLASSES[recommendation.stance]}`}>
                {copy.stances[recommendation.stance]}
              </span>
              <span className="ml-auto text-faint">
                {recommendation.agreesWithPlan ? copy.agreesWithOrder : copy.disagreesWithOrder}
              </span>
            </div>
            <p className="leading-relaxed text-muted">{recommendation.rationale}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
