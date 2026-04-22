import { formatOrderState } from "@/features/intraday/lib/format-significant-order";

type IntradayOrder = {
  line: string;
  lookup: string;
  state: string;
};

export function SignificantOrdersList({ orders }: { orders: IntradayOrder[] }) {
  return (
    <div className="panel page-stack">
      <div>
        <p className="eyebrow">Significant Orders</p>
        <h2>Current focus</h2>
      </div>
      <div className="intraday-list">
        {orders.map((order) => (
          <article key={order.line} className={formatOrderState(order.state)}>
            <div>
              <strong>{order.line}</strong>
            </div>
            <span className="muted">Vals: {order.lookup}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
