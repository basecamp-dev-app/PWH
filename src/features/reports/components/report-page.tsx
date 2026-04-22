import { ReportFilters } from "@/features/reports/components/report-filters";
import { ReportTable } from "@/features/reports/components/report-table";
import type { ReportConfig, ReportRow } from "@/features/reports/types";

export async function ReportPage({
  config,
  rows,
}: {
  config: ReportConfig;
  rows: Promise<ReportRow[]>;
}) {
  const resolvedRows = await rows;

  return (
    <section className="page-stack">
      <div className="page-heading">
        <p className="eyebrow">{config.reportType}</p>
        <h1>{config.title}</h1>
        <p className="muted">{config.description}</p>
      </div>
      <div className="stats-row">
        <div className="panel stat-card stat-card--left">
          <span className="muted">Rows Loaded</span>
          <strong>{resolvedRows.length.toLocaleString()}</strong>
        </div>
        <div className="panel stat-card stat-card--left">
          <span className="muted">Source</span>
          <strong>{config.title}</strong>
        </div>
      </div>
      <ReportFilters />
      <ReportTable rows={resolvedRows} />
    </section>
  );
}
