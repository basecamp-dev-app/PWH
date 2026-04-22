import { workbookSources } from "@/features/imports/lib/workbook-columns";

export function describeImportPlan() {
  return {
    mode: "supabase",
    sources: workbookSources,
    status: "Writes canonical workbook data into Supabase import runs",
  };
}
