export type Company = {
  id: string;
  name: string;
  ticker: string;
  createdAt: Date;
  status: CompanyStatus;
};

export type CompanyStatus = "pending" | "success" | "error";

export type ChartData = {
  [key: `value${number}`]: number;
}[];

export type ChartDataWithDate = {
  [key: `value${number}`]: number;
  date: string;
}[];

export type PieChartData = {
  name: string;
  value: number;
  fill: string;
}[];
