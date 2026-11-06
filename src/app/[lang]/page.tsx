import { notFound } from "next/navigation";
import { Suspense } from "react";

import { DICTIONARIES } from "@/common/i18n/dictionaries";
import { hasLocale } from "@/common/i18n/locales";
import { PortfolioDashboard } from "@/components/portfolio-dashboard";
import { PortfolioDashboardSkeleton } from "@/components/portfolio-dashboard-skeleton";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dictionary = DICTIONARIES[lang];

  return (
    <Suspense fallback={<PortfolioDashboardSkeleton loadingLabel={dictionary.loading} />}>
      <PortfolioDashboard locale={lang} dictionary={dictionary} />
    </Suspense>
  );
}
