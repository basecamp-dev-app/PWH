import { reportFilters } from "@/features/reports/lib/report-filter-schema";

export function ReportFilters() {
  return (
    <div className="panel filter-row">
      {reportFilters.map((filter) => (
        <div key={filter} className="filter-pill">
          {filter}
        </div>
      ))}
      <span className="muted">Supabase-backed filtering will replace the legacy combobox matrix.</span>
    </div>
  );
}
