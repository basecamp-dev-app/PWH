import { ReportPage } from "@/features/reports/components/report-page";
import { getTradedRows } from "@/features/traded/server/queries";

export async function TradedReportPage() {
  return (
    <ReportPage
      config={{
        reportType: "traded",
        title: "Traded",
        description: "V1 shared report surface for the traded ledger workflow.",
      }}
      rows={getTradedRows()}
    />
  );
}
