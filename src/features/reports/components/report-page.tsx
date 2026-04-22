import { ReportFilters } from "@/features/reports/components/report-filters";
import { ReportTable } from "@/features/reports/components/report-table";
import type { ReportConfig, ReportRow } from "@/features/reports/types";

export function ReportPage({
  config,
  rows,
}: {
  config: ReportConfig;
  rows: ReportRow[];
}) {
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
          <strong>{rows.length.toLocaleString()}</strong>
        </div>
        <div className="panel stat-card stat-card--left">
          <span className="muted">Source</span>
          <strong>{config.title}</strong>
        </div>
      </div>
      <ReportFilters />
      <ReportTable rows={rows} />
    </section>
  );
}
