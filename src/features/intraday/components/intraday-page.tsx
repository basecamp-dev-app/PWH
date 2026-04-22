import { SignificantOrdersList } from "@/features/intraday/components/significant-orders-list";
import { ValsComparisonPanel } from "@/features/intraday/components/vals-comparison-panel";
import { getIntradayData } from "@/features/intraday/server/queries";

export function IntradayPage() {
  const { significantOrders, trackedOrders } = getIntradayData();

  return (
    <section className="page-stack">
      <div className="page-heading">
        <p className="eyebrow">Intraday</p>
        <h1>Significant orders and tracked flow</h1>
        <p className="muted">
          Focus the desk on the highest-value orders, use Vals context faster, and keep tracked flow readable throughout the session.
        </p>
      </div>
      <div className="split-grid">
        <SignificantOrdersList orders={significantOrders} />
        <ValsComparisonPanel />
      </div>
      <div className="panel page-stack">
        <div>
          <p className="eyebrow">Tracked Orders</p>
          <h2>Imported legacy watchlist</h2>
        </div>
        <ul className="plain-list">
          {trackedOrders.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
