import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";
import xlsx from "xlsx";

const repoRoot = path.resolve(process.cwd(), "..");
const dataRoot = path.join(repoRoot, "Data");

const databasePath = path.join(dataRoot, "DATABASE.xlsx");
const valsPath = path.join(dataRoot, "Vals.xlsx");
const trackedPath = path.join(dataRoot, "tracked");
const metals = ["LAD", "LCU", "LND", "LZH", "PBD"];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizeDate(value) {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "number") {
    const parsed = xlsx.SSF.parse_date_code(value);
    if (!parsed) return null;
    return `${parsed.y.toString().padStart(4, "0")}-${String(parsed.m).padStart(2, "0")}-${String(parsed.d).padStart(2, "0")}`;
  }
  const asDate = new Date(value);
  if (!Number.isNaN(asDate.getTime())) {
    return asDate.toISOString().slice(0, 10);
  }
  const parts = String(value).split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
  return null;
}

function normalizeMonthValue(value) {
  if (value == null || value === "") return "";
  if (typeof value === "number") {
    const parsed = xlsx.SSF.parse_date_code(value);
    if (!parsed) return String(value);
    const date = new Date(parsed.y, parsed.m - 1, parsed.d);
    return date.toLocaleString("en-GB", { month: "short", year: "numeric" }).replace(" ", "-");
  }
  return String(value).trim();
}

function normalizeNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function parseWorkbookSheet(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];
  return xlsx.utils.sheet_to_json(sheet, { defval: "", raw: true });
}

function loadClientMap(workbook) {
  const rows = parseWorkbookSheet(workbook, "Clients");
  return new Map(
    rows
      .map((row) => Object.values(row))
      .filter((values) => values[0] && values[1])
      .map((values) => [String(values[0]).trim(), String(values[1]).trim()])
  );
}

function formatLocation(value) {
  const numeric = normalizeNumber(value);
  if (numeric == null) return String(value ?? "").trim();
  if (numeric === 0) return "LVL";
  if (numeric > 0) return Number.isInteger(numeric) ? `${numeric}c` : `${numeric.toFixed(2)}c`;
  const absolute = Math.abs(numeric);
  return Number.isInteger(absolute) ? `${absolute}b` : `${absolute.toFixed(2)}b`;
}

function normalizeTrackedKey(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function toReportRows(rows, reportType, clientMap) {
  return rows.map((row, index) => {
    const values = Object.values(row);
    const isTraded = reportType === "traded";
    const locationIndex = isTraded ? 9 : 7;
    const workflowBucket = isTraded ? String(values[7] ?? "").trim() : "";
    const mocFlag = isTraded && String(values[8] ?? "").trim() === "MOC";

    return {
      report_type: reportType,
      source_sheet: reportType === "traded" ? "Database" : reportType === "orderbook" ? "Orderbook" : "Matched",
      source_row: index + 2,
      trade_date: normalizeDate(values[0]),
      metal: String(values[1] ?? "").trim(),
      trader: String(values[2] ?? "").trim(),
      side: String(values[3] ?? "").trim(),
      lots: normalizeNumber(values[4]) ?? 0,
      prompt: normalizeMonthValue(values[5]),
      carry: normalizeMonthValue(values[6]),
      desk: reportType === "traded" ? "TR" : reportType === "orderbook" ? "OB" : "MP",
      company: clientMap.get(String(values[2] ?? "").trim()) ?? "Unknown",
      location: formatLocation(values[locationIndex]),
      workflow_bucket: workflowBucket,
      moc_flag: mocFlag,
    };
  });
}

function parseValsWorkbook() {
  if (!fs.existsSync(valsPath)) return [];
  const workbook = xlsx.readFile(valsPath, { cellDates: true });
  const rows = parseWorkbookSheet(workbook, "Vals");
  return rows.flatMap((row) => {
    const values = Object.values(row);
    const comboKey = String(values[0] ?? "").trim();

    if (!comboKey) return [];

    return metals.map((metal, index) => ({
      combo_key: comboKey,
      metal,
      value: String(values[index + 1] ?? "").trim(),
    }));
  });
}

function parseTrackedFile() {
  if (!fs.existsSync(trackedPath)) return [];
  return fs
    .readFileSync(trackedPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({ line, normalized_key: normalizeTrackedKey(line) }));
}

async function chunkedInsert(supabase, table, rows, extra = {}) {
  const chunkSize = 500;

  for (let index = 0; index < rows.length; index += chunkSize) {
    const chunk = rows.slice(index, index + chunkSize).map((row) => ({ ...row, ...extra }));
    const { error } = await supabase.from(table).insert(chunk);
    if (error) {
      throw new Error(`${table} insert failed: ${error.message}`);
    }
  }
}

async function main() {
  if (!fs.existsSync(databasePath)) {
    throw new Error(`Missing workbook: ${databasePath}`);
  }

  const supabase = createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL"), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const workbook = xlsx.readFile(databasePath, { cellDates: true });
  const clientMap = loadClientMap(workbook);
  const tradedRows = toReportRows(parseWorkbookSheet(workbook, "Database"), "traded", clientMap);
  const orderbookRows = toReportRows(parseWorkbookSheet(workbook, "Orderbook"), "orderbook", clientMap);
  const matchedRows = toReportRows(parseWorkbookSheet(workbook, "Matched"), "matched", clientMap);
  const valsRows = parseValsWorkbook();
  const trackedRows = parseTrackedFile();

  const { data: importRun, error: importRunError } = await supabase
    .from("import_runs")
    .insert({
      source: "local_workbooks",
      status: "pending",
      notes: `DATABASE.xlsx, Vals.xlsx, tracked imported from ${dataRoot}`,
      is_active: false,
    })
    .select("id")
    .single();

  if (importRunError || !importRun) {
    throw new Error(importRunError?.message ?? "Failed to create import run.");
  }

  const importRunId = importRun.id;

  try {
    await chunkedInsert(supabase, "report_rows", [...tradedRows, ...orderbookRows, ...matchedRows], { import_run_id: importRunId });
    await chunkedInsert(supabase, "vals_snapshots", valsRows, { import_run_id: importRunId });
    await chunkedInsert(supabase, "tracked_orders", trackedRows, { import_run_id: importRunId });

    const { error: deactivateRunsError } = await supabase
      .from("import_runs")
      .update({ is_active: false })
      .neq("id", importRunId);

    if (deactivateRunsError) {
      throw new Error(deactivateRunsError.message);
    }

    const { error: activateRunError } = await supabase
      .from("import_runs")
      .update({ is_active: true, status: "completed" })
      .eq("id", importRunId);

    if (activateRunError) {
      throw new Error(activateRunError.message);
    }
  } catch (error) {
    await supabase.from("import_runs").update({ status: "failed" }).eq("id", importRunId);
    throw error;
  }

  process.stdout.write("Imported local workbook data into Supabase\n");
}

main();
