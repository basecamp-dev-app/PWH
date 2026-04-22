import intradayData from "@/data/imported/intraday.json";
import matchedRows from "@/data/imported/matched.json";
import orderbookRows from "@/data/imported/orderbook.json";
import overviewData from "@/data/imported/overview.json";
import tradedRows from "@/data/imported/traded.json";

import type { ReportRow } from "@/features/reports/types";

export const mockReportRows: Record<string, ReportRow[]> = {
  traded: tradedRows as ReportRow[],
  orderbook: orderbookRows as ReportRow[],
  matched: matchedRows as ReportRow[],
};

export const mockIntradayOrders = intradayData.significantOrders;
export const mockTrackedOrders = intradayData.trackedOrders;
export const mockOverview = overviewData;
