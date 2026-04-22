import { workbookSources } from "@/features/imports/lib/workbook-columns";

export function describeImportPlan() {
  return {
    mode: "manual",
    sources: workbookSources,
    status: "Scaffolded for V1 implementation",
  };
}
