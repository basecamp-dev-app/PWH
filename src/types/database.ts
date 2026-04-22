export type ImportSource = "database_workbook" | "vals_workbook" | "tracked_file";

export type DatabaseImportRunStatus = "pending" | "completed" | "failed";

export type TrackedOrderRecord = {
  id: string;
  line: string;
};
