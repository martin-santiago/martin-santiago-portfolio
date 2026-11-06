import type { ReactNode } from "react";

type DashboardSectionProps = {
  headingId: string;
  title: string;
  subtitle: string;
  info?: ReactNode;
  children: ReactNode;
};

export function DashboardSection({ headingId, title, subtitle, info, children }: DashboardSectionProps) {
  const titleId = `${headingId}-title`;

  return (
    <section aria-labelledby={titleId} className="section-rails px-4 py-14 sm:px-10 sm:py-20">
      <div className="max-w-4xl text-2xl leading-snug text-balance text-muted sm:text-section">
        <h2 id={headingId} className="inline">
          <span id={titleId} className="font-medium text-ink">
            {title}
          </span>{" "}
          {subtitle}
        </h2>
        {info}
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}
