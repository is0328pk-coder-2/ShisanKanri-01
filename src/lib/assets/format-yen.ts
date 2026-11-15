const yenFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

export function formatYen(amount: number): string {
  if (!Number.isFinite(amount)) {
    throw new RangeError("Amount must be a finite number.");
  }

  return yenFormatter.format(amount);
}
