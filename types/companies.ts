export type Company = {
  id: string;
  name: string;
  ticker: string;
  createdAt: Date;
};

export type UserCompany = {
  id: string;
  companyId: string;
  name: string;
  ticker: string;
  createdAt: Date;
};
