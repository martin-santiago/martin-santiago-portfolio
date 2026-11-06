"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LOCALE_FLAGS, LOCALE_NAMES, LOCALES, type Locale } from "@/common/i18n/locales";

type LocaleSwitcherProps = {
  currentLocale: Locale;
  label: string;
};

export function LocaleSwitcher({ currentLocale, label }: LocaleSwitcherProps) {
  const pagePath = usePathname().slice(`/${currentLocale}`.length);

  return (
    <nav aria-label={label} className="flex h-8 items-center text-ui">
      {LOCALES.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${pagePath}`}
          hrefLang={locale}
          lang={locale}
          aria-current={locale === currentLocale ? "page" : undefined}
          className="flex h-7 items-center gap-1.5 px-2 text-muted transition-colors duration-150 hover:text-ink focus-visible:outline-2 focus-visible:outline-ink aria-[current=page]:bg-track aria-[current=page]:font-medium aria-[current=page]:text-ink"
        >
          <span aria-hidden>{LOCALE_FLAGS[locale]}</span>
          {LOCALE_NAMES[locale]}
        </Link>
      ))}
    </nav>
  );
}
