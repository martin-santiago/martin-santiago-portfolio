"use client";

import { useState } from "react";

import { streamPortfolioAdvice } from "@/app/actions/stream-portfolio-advice";
import type { Dictionary } from "@/common/i18n/dictionaries";
import type { Locale } from "@/common/i18n/locales";
import { toAdviceDraft } from "@/modules/advisor/utils/advice-draft";
import { type AdviceResult, readAdviceStream } from "@/modules/advisor/utils/advice-stream";

import { AdviceList } from "./advice-list";
import { DashboardSection } from "./dashboard-section";

type AdvicePanelProps = {
  isAdvisorEnabled: boolean;
  colorClassBySymbol: Record<string, string>;
  locale: Locale;
  copy: Dictionary["advice"];
};

type AdviceView = { status: "idle" } | { status: "writing"; adviceJson: string } | AdviceResult;

export function AdvicePanel({ isAdvisorEnabled, colorClassBySymbol, locale, copy }: AdvicePanelProps) {
  const [adviceView, setAdviceView] = useState<AdviceView>({ status: "idle" });
  const isWriting = adviceView.status === "writing";
  const completedAdvice = adviceView.status === "ok" ? adviceView.advice : null;
  const advice = isWriting ? toAdviceDraft(adviceView.adviceJson) : completedAdvice;

  const handleRequestAdvice = async () => {
    const showDraft = (adviceJson: string) => setAdviceView({ status: "writing", adviceJson });
    showDraft("");
    setAdviceView(await readAdviceStream(streamPortfolioAdvice(locale), showDraft));
  };

  return (
    <DashboardSection headingId="advice-heading" title={copy.title} subtitle={copy.subtitle}>
      <div id="advice-request" className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleRequestAdvice}
          disabled={!isAdvisorEnabled || isWriting}
          className="button-primary"
        >
          {isWriting ? copy.requesting : copy.request}
        </button>
        {!isAdvisorEnabled && <p className="text-ui text-faint">{copy.errors.disabled}</p>}
      </div>
      <div aria-live="polite" aria-busy={isWriting} className="mt-10 empty:hidden">
        {advice && <AdviceList advice={advice} colorClassBySymbol={colorClassBySymbol} copy={copy} />}
        {adviceView.status === "error" && <p className="text-ui text-sell">{copy.errors[adviceView.reason]}</p>}
      </div>
    </DashboardSection>
  );
}
