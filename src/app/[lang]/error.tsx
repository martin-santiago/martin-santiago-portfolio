"use client";

import type { ErrorInfo } from "next/error";
import { useParams } from "next/navigation";

import { SERVER_ERROR_COPY } from "@/common/i18n/dictionaries/server-error";
import { resolveLocale } from "@/common/i18n/locales";

export default function ErrorPage({ retry }: ErrorInfo) {
  const { lang } = useParams<{ lang: string }>();
  const copy = SERVER_ERROR_COPY[resolveLocale(lang)];

  return (
    <section className="section-rails flex flex-col items-start gap-6 px-4 py-20 sm:px-10 sm:py-28">
      <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">{copy.heading}</h1>
      <p className="max-w-2xl text-base leading-relaxed text-muted">{copy.body}</p>
      <button type="button" onClick={retry} className="button-primary">
        {copy.retry}
      </button>
    </section>
  );
}
