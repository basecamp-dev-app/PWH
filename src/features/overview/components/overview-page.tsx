import { TopTenPanel } from "@/features/overview/components/top-ten-panel";
import { WeekdaySummary } from "@/features/overview/components/weekday-summary";
import { YearHeatmap } from "@/features/overview/components/year-heatmap";
import { getOverviewData } from "@/features/overview/server/queries";

export function OverviewPage() {
  const data = getOverviewData();

  return (
    <section className="page-stack">
      <div className="page-heading">
        <p className="eyebrow">Overview</p>
        <h1>Calendar and desk summary</h1>
        <p className="muted">
          V1 preserves the overview workflow with a cleaner layout and a smaller component graph.
        </p>
      </div>
      <div className="stats-row">
        <div className="panel stat-card">
          <span className="muted">Year total</span>
          <strong>{data.yearlyTotal}</strong>
        </div>
        <div className="panel stat-card">
          <span className="muted">Month total</span>
          <strong>{data.monthTotal}</strong>
        </div>
      </div>
      <div className="split-grid">
        <YearHeatmap />
        <WeekdaySummary rows={data.weekdaySummary} />
      </div>
      <TopTenPanel items={data.topMoves} />
    </section>
  );
}
