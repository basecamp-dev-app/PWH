export function ValsComparisonPanel() {
  return (
    <div className="panel page-stack">
      <div>
        <p className="eyebrow">Vals Comparison</p>
        <h2>Workflow notes</h2>
      </div>
      <ul className="plain-list muted">
        <li>Use imported `Vals.xlsx` data instead of runtime workbook lookups.</li>
        <li>Highlight alert and watch states in the list rather than inline desktop tags.</li>
        <li>Tracked orders will move from flat-file storage to Supabase in the next pass.</li>
      </ul>
    </div>
  );
}
