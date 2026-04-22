import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import xlsx from "xlsx";

const repoRoot = path.resolve(process.cwd(), "..");
const dataRoot = path.join(repoRoot, "Data");
const outputDir = path.join(process.cwd(), "src", "data", "imported");

const databasePath = path.join(dataRoot, "DATABASE.xlsx");
const valsPath = path.join(dataRoot, "Vals.xlsx");
const trackedPath = path.join(dataRoot, "tracked");
const metals = ["LAD", "LCU", "LND", "LZH", "PBD"];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function normalizeDate(value) {
  if (!value) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "number") {
    const parsed = xlsx.SSF.parse_date_code(value);
    if (!parsed) return String(value);
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
  return String(value);
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

function toReportRows(rows, source, clientMap) {
  return rows.map((row) => {
    const values = Object.values(row);
    const locationIndex = source === "Traded" ? 9 : 7;
    return {
      tradeDate: normalizeDate(values[0]),
      metal: String(values[1] ?? "").trim(),
      trader: String(values[2] ?? "").trim(),
      side: String(values[3] ?? "").trim(),
      lots: normalizeNumber(values[4]) ?? 0,
      prompt: normalizeMonthValue(values[5]),
      carry: normalizeMonthValue(values[6]),
      desk: source === "Traded" ? "TR" : source === "Orderbook" ? "OB" : "MP",
      company: clientMap.get(String(values[2] ?? "").trim()) ?? "Unknown",
      location: values[locationIndex] === "" ? "" : String(values[locationIndex]).trim(),
      source,
    };
  });
}

function formatLocation(value) {
  const numeric = normalizeNumber(value);
  if (numeric == null) return String(value ?? "").trim();
  if (numeric === 0) return "LVL";
  if (numeric > 0) return Number.isInteger(numeric) ? `${numeric}c` : `${numeric.toFixed(2)}c`;
  const absolute = Math.abs(numeric);
  return Number.isInteger(absolute) ? `${absolute}b` : `${absolute.toFixed(2)}b`;
}

function parseValsWorkbook() {
  if (!fs.existsSync(valsPath)) return [];
  const workbook = xlsx.readFile(valsPath, { cellDates: true });
  const rows = parseWorkbookSheet(workbook, "Vals");
  return rows.map((row) => {
    const values = Object.values(row);
    const record = { combo: String(values[0] ?? "").trim() };
    metals.forEach((metal, index) => {
      record[metal] = values[index + 1] ?? "";
    });
    return record;
  });
}

function parseTrackedFile() {
  if (!fs.existsSync(trackedPath)) return [];
  return fs.readFileSync(trackedPath, "utf8").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function buildIntraday(tradedRows, orderbookRows, matchedRows, valsRows, trackedLines) {
  const latestDate = [...tradedRows, ...orderbookRows, ...matchedRows].map((row) => row.tradeDate).filter(Boolean).sort().at(-1);
  const valsLookup = new Map(valsRows.filter((row) => row.combo).map((row) => [String(row.combo), row]));

  return {
    significantOrders: [...tradedRows, ...orderbookRows, ...matchedRows]
      .filter((row) => row.tradeDate === latestDate && row.lots > 25)
      .map((row) => {
        const combo = `${row.prompt} / ${row.carry}`;
        const vals = valsLookup.get(combo);
        const lookup = vals && row.metal in vals ? String(vals[row.metal]) : "";
        const line = `${row.trader} ${row.side}s ${row.lots} Lots of ${row.metal}, ${combo} at ${formatLocation(row.location)} (${row.desk})`;
        return {
          line,
          lookup,
          state: trackedLines.some((entry) => entry.includes(line.split(" at ")[0])) ? "watch" : "normal",
        };
      }),
    trackedOrders: trackedLines,
  };
}

function buildOverview(tradedRows) {
  const rows = tradedRows.filter((row) => row.tradeDate);
  const totalLots = rows.reduce((sum, row) => sum + row.lots, 0);
  const latestMonthPrefix = rows.map((row) => row.tradeDate.slice(0, 7)).sort().at(-1) ?? "";
  const monthlyRows = rows.filter((row) => row.tradeDate.startsWith(latestMonthPrefix));
  const monthLots = monthlyRows.reduce((sum, row) => sum + row.lots, 0);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekdayTotals = new Map();

  for (const row of monthlyRows) {
    const weekday = weekdays[new Date(`${row.tradeDate}T00:00:00`).getDay()];
    weekdayTotals.set(weekday, (weekdayTotals.get(weekday) ?? 0) + row.lots);
  }

  return {
    yearlyTotal: `${totalLots.toLocaleString()} lots`,
    monthTotal: `${monthLots.toLocaleString()} lots`,
    weekdaySummary: ["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => ({
      day,
      value: `${(weekdayTotals.get(day) ?? 0).toLocaleString()} lots`,
    })),
    topMoves: rows.slice().sort((a, b) => b.lots - a.lots).slice(0, 3).map((row) => `${row.tradeDate}: ${row.trader} ${row.side} ${row.lots} ${row.metal}`),
  };
}

function main() {
  ensureDir(outputDir);
  if (!fs.existsSync(databasePath)) {
    throw new Error(`Missing workbook: ${databasePath}`);
  }

  const workbook = xlsx.readFile(databasePath, { cellDates: true });
  const clientMap = loadClientMap(workbook);
  const tradedRows = toReportRows(parseWorkbookSheet(workbook, "Database"), "Traded", clientMap);
  const orderbookRows = toReportRows(parseWorkbookSheet(workbook, "Orderbook"), "Orderbook", clientMap);
  const matchedRows = toReportRows(parseWorkbookSheet(workbook, "Matched"), "Matched", clientMap);
  const valsRows = parseValsWorkbook();
  const trackedRows = parseTrackedFile();

  fs.writeFileSync(path.join(outputDir, "traded.json"), JSON.stringify(tradedRows, null, 2));
  fs.writeFileSync(path.join(outputDir, "orderbook.json"), JSON.stringify(orderbookRows, null, 2));
  fs.writeFileSync(path.join(outputDir, "matched.json"), JSON.stringify(matchedRows, null, 2));
  fs.writeFileSync(path.join(outputDir, "intraday.json"), JSON.stringify(buildIntraday(tradedRows, orderbookRows, matchedRows, valsRows, trackedRows), null, 2));
  fs.writeFileSync(path.join(outputDir, "overview.json"), JSON.stringify(buildOverview(tradedRows), null, 2));
  fs.writeFileSync(path.join(outputDir, "vals.json"), JSON.stringify(valsRows, null, 2));

  process.stdout.write("Imported local workbook data into src/data/imported\n");
}

main();
