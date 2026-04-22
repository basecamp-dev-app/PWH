import { TopTenPanel } from "@/features/overview/components/top-ten-panel";
import { WeekdaySummary } from "@/features/overview/components/weekday-summary";
import { YearHeatmap } from "@/features/overview/components/year-heatmap";
import { getOverviewData } from "@/features/overview/server/queries";

export async function OverviewPage() {
  const data = await getOverviewData();

  return (
    <section className="page-stack">
      <div className="page-heading">
        <p className="eyebrow">Overview</p>
        <h1>Calendar, pace, and desk summary</h1>
        <p className="muted">
          Review the shape of trading activity quickly with a tighter summary layer and more focused operational framing.
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
        <YearHeatmap months={data.heatmapMonths} />
        <WeekdaySummary rows={data.weekdaySummary} />
      </div>
      <TopTenPanel items={data.topMoves} />
    </section>
  );
}
