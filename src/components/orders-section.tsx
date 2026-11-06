import type { Dictionary } from "@/common/i18n/dictionaries";
import type { Locale } from "@/common/i18n/locales";
import type { PositionOverview } from "@/modules/portfolio/dtos/portfolio-overview.dto";
import type { TradeSide } from "@/modules/portfolio/entities/trade";

import { DashboardSection } from "./dashboard-section";
import { InfoTip } from "./info-tip";
import type { RankedOrder } from "./order-card";
import { OrderGroup } from "./order-group";

type OrdersSectionProps = {
  positions: PositionOverview[];
  colorClassBySymbol: Record<string, string>;
  locale: Locale;
  copy: Dictionary["orders"];
  infoCopy: Dictionary["info"];
};

const ORDER_SIDES: TradeSide[] = ["sell", "buy"];

function rankOrdersOnSide({
  positions,
  colorClassBySymbol,
  side,
}: {
  positions: PositionOverview[];
  colorClassBySymbol: Record<string, string>;
  side: TradeSide;
}): RankedOrder[] {
  return positions
    .flatMap((position) => (position.trade?.side === side ? [{ position, trade: position.trade }] : []))
    .sort((first, second) => second.trade.amount - first.trade.amount)
    .map((order, index) => ({ ...order, rank: index + 1, colorClass: colorClassBySymbol[order.position.symbol] }));
}

export function OrdersSection({ positions, colorClassBySymbol, locale, copy, infoCopy }: OrdersSectionProps) {
  const ordersBySide = ORDER_SIDES.map((side) => ({ side, orders: rankOrdersOnSide({ positions, colorClassBySymbol, side }) }));
  const hasOrders = ordersBySide.some(({ orders }) => orders.length > 0);

  return (
    <DashboardSection
      headingId="orders-heading"
      title={copy.title}
      subtitle={copy.subtitle}
      info={<InfoTip id="orders-section-info" label={`${infoCopy.label}: ${copy.title}`} text={infoCopy.ordersSection} />}
    >
      {!hasOrders && <p className="text-base text-muted">{copy.empty}</p>}
      {hasOrders && (
        <div id="orders-plan" className="grid gap-10 lg:grid-cols-2 lg:gap-8">
          {ordersBySide.map(({ side, orders }) => (
            <OrderGroup key={side} side={side} orders={orders} locale={locale} copy={copy} />
          ))}
        </div>
      )}
    </DashboardSection>
  );
}
