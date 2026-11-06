import type { TradeSide } from "@/modules/portfolio/entities/trade";

type DriftTrackProps = {
  currentPercentage: number;
  targetPercentage: number;
  scalePercentage: number;
  side: TradeSide | null;
};

const TICK_OFFSETS = [20, 40, 60, 80];

const GAP_CLASSES: Record<TradeSide, string> = {
  buy: "bg-buy/35",
  sell: "bg-sell/35",
};

export function DriftTrack({ currentPercentage, targetPercentage, scalePercentage, side }: DriftTrackProps) {
  const toOffset = (percentage: number) => (percentage / scalePercentage) * 100;
  const gapStart = toOffset(Math.min(currentPercentage, targetPercentage));
  const gapWidth = toOffset(Math.abs(currentPercentage - targetPercentage));

  return (
    <div aria-hidden className="relative h-1.75 w-full bg-track">
      {TICK_OFFSETS.map((tickOffset) => (
        <span key={tickOffset} className="absolute top-0 h-full w-px bg-line-strong" style={{ left: `${tickOffset}%` }} />
      ))}
      {side && (
        <span className={`absolute inset-y-0 ${GAP_CLASSES[side]}`} style={{ left: `${gapStart}%`, width: `${gapWidth}%` }} />
      )}
      <span
        className="absolute top-1/2 h-3.25 w-1.75 -translate-1/2 border border-ink bg-page"
        style={{ left: `${toOffset(targetPercentage)}%` }}
      />
      <span
        className="absolute top-1/2 h-3.25 w-1.75 -translate-1/2 bg-ink"
        style={{ left: `${toOffset(currentPercentage)}%` }}
      />
    </div>
  );
}
