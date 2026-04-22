export function WeekdaySummary({
  rows,
}: {
  rows: Array<{ day: string; value: string }>;
}) {
  return (
    <div className="panel page-stack">
      <div>
        <p className="eyebrow">Weekday Summary</p>
        <h2>Average daily totals</h2>
      </div>
      <div className="weekday-grid">
        {rows.map((row) => (
          <div key={row.day} className="weekday-card">
            <strong>{row.day}</strong>
            <span>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
