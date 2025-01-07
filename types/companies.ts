export type Company = {
  id: string;
  name: string;
  ticker: string;
  createdAt: Date;
};

export type Dashboard = {
  id: string;
  companyId: string;
  name: string;
  ticker: string;
  createdAt: Date;
};
