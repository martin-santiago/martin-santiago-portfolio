import type { Dictionary } from "@/common/i18n/dictionaries";
import type { Locale } from "@/common/i18n/locales";
import { formatUsd } from "@/common/utils/format";
import type { TradeSide } from "@/modules/portfolio/entities/trade";
import { totalTradeAmount } from "@/modules/portfolio/utils/totals";

import { OrderCard, type RankedOrder } from "./order-card";

type OrderGroupProps = {
  side: TradeSide;
  orders: RankedOrder[];
  locale: Locale;
  copy: Dictionary["orders"];
};

const SIDE_HEADER_CLASSES: Record<TradeSide, { text: string; border: string; marker: string }> = {
  buy: { text: "text-buy", border: "border-buy", marker: "bg-buy" },
  sell: { text: "text-sell", border: "border-sell", marker: "bg-sell" },
};

export function OrderGroup({ side, orders, locale, copy }: OrderGroupProps) {
  const headerClasses = SIDE_HEADER_CLASSES[side];
  const title = side === "sell" ? copy.sellGroup : copy.buyGroup;
  const hint = side === "sell" ? copy.sellGroupHint(orders.length) : copy.buyGroupHint(orders.length);

  return (
    <div className="flex flex-col gap-4">
      <div className={`flex items-baseline justify-between gap-4 border-b-2 pb-3 ${headerClasses.border}`}>
        <h3 className={`flex items-center gap-2 text-lg font-medium ${headerClasses.text}`}>
          <span aria-hidden className={`size-3 ${headerClasses.marker}`} />
          {title}
        </h3>
        <p className="text-lg font-medium tabular-nums">{formatUsd(totalTradeAmount(orders.map(({ trade }) => trade)), locale)}</p>
      </div>
      <p className="-mt-2 text-ui text-muted">{hint}</p>
      <ol className="flex flex-col gap-2">
        {orders.map((order) => (
          <OrderCard key={order.position.symbol} order={order} locale={locale} copy={copy} />
        ))}
      </ol>
    </div>
  );
}
