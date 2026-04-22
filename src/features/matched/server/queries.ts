import { getReportRows } from "@/server/data/queries";

export function getMatchedRows() {
  return getReportRows("matched_view");
}
