import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertPricesToPercentChange = (prices: number[]) => {
  const initialPrice = prices[0];
  const percentChange = prices.map(
    (price) => ((price - initialPrice) / initialPrice) * 100,
  );
  return percentChange;
};

export function formatValue(value: number) {
  if (value === 0) return "0";
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value <= 10) return value.toFixed(2);
  if (value <= 100) return value.toFixed(1);
  return value.toFixed(0);
}
