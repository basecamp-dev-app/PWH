import { cache } from "react";

import { normalizeTrackedKey } from "@/lib/formatters";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type DatabaseReportRow = {
  trade_date: string | null;
  metal: string;
  trader: string;
  side: string;
  lots: number;
  prompt: string;
  carry: string;
  desk: string;
  company: string;
  location: string;
  source_sheet: string;
};

type DatabaseIntradayRow = {
  line: string;
  lookup: string;
};

type DatabaseTrackedOrder = {
  id: string;
  line: string;
};

type DatabaseValsSnapshot = {
  combo_key: string;
  metal: string;
  value: string;
};

function mapReportRows(rows: DatabaseReportRow[]) {
  return rows.map((row) => ({
    tradeDate: row.trade_date ?? "",
    metal: row.metal,
    trader: row.trader,
    side: row.side,
    lots: Number(row.lots ?? 0),
    prompt: row.prompt,
    carry: row.carry,
    desk: row.desk,
    company: row.company,
    location: row.location,
    source: row.source_sheet,
  }));
}

export const getReportRows = cache(async (viewName: "traded_view" | "orderbook_view" | "matched_view") => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from(viewName).select("trade_date, metal, trader, side, lots, prompt, carry, desk, company, location, source_sheet").order("trade_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return mapReportRows((data ?? []) as DatabaseReportRow[]);
});

export const getIntradayRuntimeData = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const [{ data: orders, error: ordersError }, { data: trackedOrders, error: trackedError }, { data: valsRows, error: valsError }] = await Promise.all([
    supabase.from("intraday_significant_orders_view").select("line, lookup").order("line"),
    supabase.from("tracked_orders").select("id, line").eq("is_active", true).order("created_at", { ascending: true }),
    supabase.from("active_vals_snapshots").select("combo_key, metal, value").order("combo_key"),
  ]);

  if (ordersError) throw new Error(ordersError.message);
  if (trackedError) throw new Error(trackedError.message);
  if (valsError) throw new Error(valsError.message);

  const trackedKeys = new Set(((trackedOrders ?? []) as DatabaseTrackedOrder[]).map((row) => normalizeTrackedKey(row.line)));

  return {
    significantOrders: ((orders ?? []) as DatabaseIntradayRow[]).map((row) => ({
      line: row.line,
      lookup: row.lookup,
      state: trackedKeys.has(normalizeTrackedKey(row.line.split(" at ")[0] ?? row.line)) ? "watch" : "normal",
    })),
    trackedOrders: ((trackedOrders ?? []) as DatabaseTrackedOrder[]).map((row) => ({ id: row.id, line: row.line })),
    valsSnapshots: (valsRows ?? []) as DatabaseValsSnapshot[],
  };
});

export const getOverviewRuntimeData = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("traded_view").select("trade_date, trader, side, lots, metal").order("trade_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as Array<{
    trade_date: string | null;
    trader: string;
    side: string;
    lots: number;
    metal: string;
  }>;

  const filteredRows = rows.filter((row) => row.trade_date);
  const totalLots = filteredRows.reduce((sum, row) => sum + Number(row.lots ?? 0), 0);
  const latestMonthPrefix = filteredRows.map((row) => row.trade_date?.slice(0, 7) ?? "").sort().at(-1) ?? "";
  const monthlyRows = filteredRows.filter((row) => (row.trade_date ?? "").startsWith(latestMonthPrefix));
  const monthLots = monthlyRows.reduce((sum, row) => sum + Number(row.lots ?? 0), 0);
  const weekdayTotals = new Map<string, number>();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (const row of monthlyRows) {
    const weekday = weekdays[new Date(`${row.trade_date}T00:00:00`).getDay()];
    weekdayTotals.set(weekday, (weekdayTotals.get(weekday) ?? 0) + Number(row.lots ?? 0));
  }

  const monthMap = new Map<string, number>();
  for (const row of filteredRows) {
    const key = (row.trade_date ?? "").slice(0, 7);
    monthMap.set(key, (monthMap.get(key) ?? 0) + Number(row.lots ?? 0));
  }

  return {
    yearlyTotal: `${totalLots.toLocaleString()} lots`,
    monthTotal: `${monthLots.toLocaleString()} lots`,
    weekdaySummary: ["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => ({
      day,
      value: `${(weekdayTotals.get(day) ?? 0).toLocaleString()} lots`,
    })),
    topMoves: filteredRows
      .slice()
      .sort((a, b) => Number(b.lots ?? 0) - Number(a.lots ?? 0))
      .slice(0, 3)
      .map((row) => `${row.trade_date}: ${row.trader} ${row.side} ${row.lots} ${row.metal}`),
    heatmapMonths: Array.from(monthMap.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .slice(-12)
      .map(([month, lots]) => ({ month, lots })),
  };
});
