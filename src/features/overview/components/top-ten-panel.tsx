export function TopTenPanel({ items }: { items: string[] }) {
  return (
    <div className="panel page-stack">
      <div>
        <p className="eyebrow">Desk Notes</p>
        <h2>Current narrative</h2>
      </div>
      <ul className="plain-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
