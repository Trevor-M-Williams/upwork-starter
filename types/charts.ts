export type ChartData = {
  [key: `value${number}`]: number;
}[];

export type ChartDataWithDate = ChartData &
  {
    date: string;
  }[];

export type PieChartData = {
  name: string;
  value: number;
  fill: string;
}[];
