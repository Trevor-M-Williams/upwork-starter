export type Company = {
  id: string;
  name: string;
  ticker: string;
  createdAt: Date;
  status: CompanyStatus;
};

export type CompanyStatus = "pending" | "success" | "error";
