export function ValsComparisonPanel({
  valsSnapshots,
}: {
  valsSnapshots: Array<{ combo_key: string; metal: string; value: string }>;
}) {
  return (
    <div className="panel page-stack">
      <div>
        <p className="eyebrow">Vals Comparison</p>
        <h2>Imported lookup snapshots</h2>
      </div>
      <div className="vals-grid muted">
        {valsSnapshots.slice(0, 12).map((row) => (
          <div key={`${row.combo_key}-${row.metal}`} className="vals-card">
            <strong>{row.combo_key}</strong>
            <span>{row.metal}</span>
            <span>Vals: {row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
