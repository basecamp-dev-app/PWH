import { reportColumns } from "@/features/reports/lib/report-column-defs";
import type { ReportRow } from "@/features/reports/types";

export function ReportTable({ rows }: { rows: ReportRow[] }) {
  return (
    <div className="panel table-shell">
      <table>
        <thead>
          <tr>
            {reportColumns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.tradeDate}-${row.trader}-${row.source}-${row.prompt}`}>
              {reportColumns.map((column) => (
                <td key={column}>{String(row[column as keyof ReportRow])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
