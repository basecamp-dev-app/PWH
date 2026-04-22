export type ReportType = "traded" | "orderbook" | "matched";

export type ReportRow = {
  tradeDate: string;
  metal: string;
  trader: string;
  side: string;
  lots: number;
  prompt: string;
  carry: string;
  desk: string;
  company: string;
  location: string;
  source: string;
};

export type ReportConfig = {
  reportType: ReportType;
  title: string;
  description: string;
};
