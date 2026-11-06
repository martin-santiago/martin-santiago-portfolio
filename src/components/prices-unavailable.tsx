import type { Dictionary } from "@/common/i18n/dictionaries";
import type { Locale } from "@/common/i18n/locales";

type PricesUnavailableProps = {
  unavailableSymbols: string[];
  locale: Locale;
  copy: Dictionary["pricesUnavailable"];
};

export function PricesUnavailable({ unavailableSymbols, locale, copy }: PricesUnavailableProps) {
  return (
    <section className="section-rails flex flex-col items-start gap-6 px-4 py-20 sm:px-10 sm:py-28">
      <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">{copy.heading(unavailableSymbols.join(", "))}</h1>
      <p className="max-w-2xl text-base leading-relaxed text-muted">{copy.body}</p>
      <form action={`/${locale}`}>
        <button type="submit" className="button-primary">
          {copy.reload}
        </button>
      </form>
    </section>
  );
}
