import { heatmapTone } from "@/features/overview/lib/heatmap-colors";

export function YearHeatmap() {
  const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];

  return (
    <div className="panel page-stack">
      <div>
        <p className="eyebrow">Year Overview</p>
        <h2>Calendar heatmap placeholder</h2>
      </div>
      <div className="heatmap-grid">
        {months.map((month, index) => (
          <div key={month} className={`heatmap-cell ${heatmapTone(index)}`}>
            {month}
          </div>
        ))}
      </div>
    </div>
  );
}
