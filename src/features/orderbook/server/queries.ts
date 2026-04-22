import { getReportRows } from "@/server/data/queries";

export function getOrderbookRows() {
  return getReportRows("orderbook_view");
}
