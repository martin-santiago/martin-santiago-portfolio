type PortfolioDashboardSkeletonProps = {
  loadingLabel: string;
};

const SKELETON_CARD_COUNT = 3;

export function PortfolioDashboardSkeleton({ loadingLabel }: PortfolioDashboardSkeletonProps) {
  return (
    <div aria-busy="true" aria-label={loadingLabel} className="motion-safe:animate-pulse">
      <div className="section-rails flex flex-col gap-4 px-4 pt-16 pb-12 sm:px-10 sm:pt-28">
        <div className="h-6 w-56 bg-track" />
        <div className="flex h-16 gap-6">
          <div className="w-80 bg-track" />
          <div className="dot-matrix hidden flex-1 sm:block" />
        </div>
      </div>
      <div className="section-rails flex flex-col gap-3 px-4 py-14 sm:px-10 sm:py-20">
        <div className="h-7 w-96 max-w-full bg-track" />
        <div className="mt-8 h-12 bg-track" />
        <div className="h-12 bg-track" />
      </div>
      <div className="section-rails grid gap-3 px-4 py-14 sm:px-10 sm:py-20 lg:grid-cols-3">
        {Array.from({ length: SKELETON_CARD_COUNT }, (_, cardIndex) => (
          <div key={cardIndex} className="h-44 border border-line bg-surface" />
        ))}
      </div>
    </div>
  );
}
