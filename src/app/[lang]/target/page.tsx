import { notFound } from "next/navigation";
import { Suspense } from "react";

import { DICTIONARIES } from "@/common/i18n/dictionaries";
import { hasLocale } from "@/common/i18n/locales";
import { PortfolioDashboardSkeleton } from "@/components/portfolio-dashboard-skeleton";
import { TargetAllocationEditor } from "@/components/target-allocation-editor";

export default async function TargetAllocationPage({ params }: PageProps<"/[lang]/target">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dictionary = DICTIONARIES[lang];

  return (
    <Suspense fallback={<PortfolioDashboardSkeleton loadingLabel={dictionary.loading} />}>
      <TargetAllocationEditor locale={lang} copy={dictionary.targetEditor} infoCopy={dictionary.info} />
    </Suspense>
  );
}
