export function formatOrderState(state: string) {
  if (state === "alert") return "intraday-order intraday-order--alert";
  if (state === "watch") return "intraday-order intraday-order--watch";
  return "intraday-order";
}
