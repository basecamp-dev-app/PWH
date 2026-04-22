import { ReportPage } from "@/features/reports/components/report-page";
import { getMatchedRows } from "@/features/matched/server/queries";

export async function MatchedReportPage() {
  return (
    <ReportPage
      config={{
        reportType: "matched",
        title: "Matched",
        description: "V1 shared report surface for the matched workflow.",
      }}
      rows={getMatchedRows()}
    />
  );
}
