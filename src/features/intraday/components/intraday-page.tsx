import { SignificantOrdersList } from "@/features/intraday/components/significant-orders-list";
import {
  createTrackedOrderAction,
  deleteTrackedOrderAction,
  updateTrackedOrderAction,
} from "@/features/intraday/server/actions";
import { ValsComparisonPanel } from "@/features/intraday/components/vals-comparison-panel";
import { getIntradayData } from "@/features/intraday/server/queries";

export async function IntradayPage() {
  const { significantOrders, trackedOrders, valsSnapshots } = await getIntradayData();

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
        <ValsComparisonPanel valsSnapshots={valsSnapshots} />
      </div>
      <div className="panel page-stack">
        <div>
          <p className="eyebrow">Tracked Orders</p>
          <h2>Supabase watchlist</h2>
        </div>
        <form className="tracked-order-form" action={createTrackedOrderAction}>
          <label>
            New tracked order
            <input type="text" name="line" placeholder="Trader buys 30 Lots of LCU, Jun-2026 / Jul-2026 at 2c (TR)" required />
          </label>
          <button type="submit">Add tracked order</button>
        </form>
        <div className="tracked-order-list">
          {trackedOrders.map((entry) => (
            <div key={entry.id} className="tracked-order-card">
              <form className="tracked-order-edit" action={updateTrackedOrderAction}>
                <input type="hidden" name="id" value={entry.id} />
                <input type="text" name="line" defaultValue={entry.line} aria-label="Tracked order" required />
                <button type="submit">Save</button>
              </form>
              <form action={deleteTrackedOrderAction}>
                <input type="hidden" name="id" value={entry.id} />
                <button type="submit" className="button-secondary">Delete</button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
