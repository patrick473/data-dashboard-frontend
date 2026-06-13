export function formatNumber(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${parseFloat((value / 1_000_000).toPrecision(3))} M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `${parseFloat((value / 1_000).toPrecision(3))} K`;
  }
  return String(value);
}
