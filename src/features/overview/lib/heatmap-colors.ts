export function heatmapTone(index: number) {
  const tones = ["heat-1", "heat-2", "heat-3", "heat-4", "heat-5"];
  return tones[index % tones.length];
}
