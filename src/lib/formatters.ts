export function normalizeTrackedKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function formatLots(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export function formatLocation(value: string | number | null | undefined) {
  if (value == null || value === "") return "";

  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return String(value).trim();
  }

  if (numeric === 0) return "LVL";
  if (numeric > 0) return Number.isInteger(numeric) ? `${numeric}c` : `${numeric.toFixed(2)}c`;

  const absolute = Math.abs(numeric);
  return Number.isInteger(absolute) ? `${absolute}b` : `${absolute.toFixed(2)}b`;
}
