import { ReportPage } from "@/features/reports/components/report-page";
import { getOrderbookRows } from "@/features/orderbook/server/queries";

export function OrderbookReportPage() {
  return (
    <ReportPage
      config={{
        reportType: "orderbook",
        title: "Orderbook",
        description: "V1 shared report surface for the orderbook workflow.",
      }}
      rows={getOrderbookRows()}
    />
  );
}
