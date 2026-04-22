import { heatmapTone } from "@/features/overview/lib/heatmap-colors";

export function YearHeatmap({
  months,
}: {
  months: Array<{ month: string; lots: number }>;
}) {
  const entries = months.length > 0 ? months : [{ month: "No data", lots: 0 }];

  return (
    <div className="panel page-stack">
      <div>
        <p className="eyebrow">Year Overview</p>
        <h2>Imported monthly pace</h2>
      </div>
      <div className="heatmap-grid">
        {entries.map((entry, index) => (
          <div key={entry.month} className={`heatmap-cell ${heatmapTone(index)}`}>
            <strong>{entry.month}</strong>
            <span>{entry.lots.toLocaleString()} lots</span>
          </div>
        ))}
      </div>
    </div>
  );
}
