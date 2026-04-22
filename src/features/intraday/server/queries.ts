import { mockIntradayOrders, mockTrackedOrders } from "@/server/shared/mock-data";

export function getIntradayData() {
  return {
    significantOrders: mockIntradayOrders,
    trackedOrders: mockTrackedOrders,
  };
}
