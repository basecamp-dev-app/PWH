import { SignificantOrdersList } from "@/features/intraday/components/significant-orders-list";
import { ValsComparisonPanel } from "@/features/intraday/components/vals-comparison-panel";
import { getIntradayData } from "@/features/intraday/server/queries";

export function IntradayPage() {
  const { significantOrders, trackedOrders } = getIntradayData();

  return (
    <section className="page-stack">
      <div className="page-heading">
        <p className="eyebrow">Intraday</p>
        <h1>Significant orders workflow</h1>
        <p className="muted">
          V1 keeps the significant-orders and tracked-orders workflow while removing Excel reads from the UI.
        </p>
      </div>
      <div className="split-grid">
        <SignificantOrdersList orders={significantOrders} />
        <ValsComparisonPanel />
      </div>
      <div className="panel page-stack">
        <div>
          <p className="eyebrow">Tracked Orders</p>
          <h2>Imported from legacy flat file</h2>
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
