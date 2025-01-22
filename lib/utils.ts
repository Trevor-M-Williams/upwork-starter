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
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (value === 0) return "0";
  if (absValue >= 10_000_000_000)
    return `${sign}${(absValue / 1_000_000_000).toFixed(0)}B`;
  if (absValue >= 1_000_000_000)
    return `${sign}${(absValue / 1_000_000_000).toFixed(1)}B`;
  if (absValue >= 10_000_000)
    return `${sign}${(absValue / 1_000_000).toFixed(0)}M`;
  if (absValue >= 1_000_000)
    return `${sign}${(absValue / 1_000_000).toFixed(1)}M`;
  if (absValue <= 10) return `${sign}${absValue.toFixed(2)}`;
  if (absValue <= 100) return `${sign}${absValue.toFixed(1)}`;
  return `${sign}${absValue.toFixed(0)}`;
}

export function convertCamelCaseToTitleCase(str: string) {
  return str.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
    return str.toUpperCase();
  });
}
