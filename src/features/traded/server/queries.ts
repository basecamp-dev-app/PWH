import { getReportRows } from "@/server/data/queries";

export function getTradedRows() {
  return getReportRows("traded_view");
}
