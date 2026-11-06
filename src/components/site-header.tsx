import Link from "next/link";

import { REPOSITORY_URL } from "@/common/constants/site";
import type { Dictionary } from "@/common/i18n/dictionaries";
import type { Locale } from "@/common/i18n/locales";

import { BrandMark } from "./brand-mark";
import { LocaleSwitcher } from "./locale-switcher";

type SiteHeaderProps = {
  locale: Locale;
  copy: Dictionary["site"];
};

export function SiteHeader({ locale, copy }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-page">
      <div className="section-rails mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-10">
        <Link href={`/${locale}`} className="flex min-w-0 items-center gap-2.5 text-sm leading-tight font-medium uppercase sm:text-lg">
          <BrandMark />
          {copy.name}
        </Link>
        <div className="flex items-center gap-3">
          <LocaleSwitcher currentLocale={locale} label={copy.localeSwitcherLabel} />
          <a href={REPOSITORY_URL} className="button-secondary hidden sm:inline-flex">
            {copy.repository}
          </a>
        </div>
      </div>
    </header>
  );
}
