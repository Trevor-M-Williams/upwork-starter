import { CompanyProfile } from "@/types/financials";

export type Company = {
  id: string;
  name: string;
  ticker: string;
  industry: string;
  sector: string;
  profile: CompanyProfile;
  peers: string[];
  createdAt: Date;
};

export type Dashboard = {
  id: string;
  userId: string;
  companyId: string;
  company: Company;
  createdAt: Date;
};
