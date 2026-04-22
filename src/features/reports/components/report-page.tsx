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
      <ReportFilters />
      <ReportTable rows={rows} />
    </section>
  );
}
