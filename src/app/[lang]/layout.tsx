import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { notFound } from "next/navigation";

import { DICTIONARIES } from "@/common/i18n/dictionaries";
import { hasLocale, LOCALES } from "@/common/i18n/locales";
import { SiteHeader } from "@/components/site-header";

import "../globals.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? DICTIONARIES[lang].metadata : {};
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${plexMono.variable} antialiased`}>
      <body className="min-h-dvh font-mono text-ui">
        <SiteHeader locale={lang} copy={DICTIONARIES[lang].site} />
        <main className="mx-auto max-w-7xl">{children}</main>
      </body>
    </html>
  );
}
