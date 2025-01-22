"use server";

import { db } from "@/server/db";
import { companies, dashboards } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import {
  fetchCompanyPeers,
  fetchCompanyProfile,
} from "@/server/actions/financials";

export const getCompanyById = async (id: string) => {
  return await db.query.companies.findFirst({
    where: eq(companies.id, id),
  });
};

export const getCompanyByDashboardId = async (dashboardId: string) => {
  return await db.query.dashboards.findFirst({
    where: eq(dashboards.id, dashboardId),
    with: {
      company: true,
    },
  });
};

export const createCompany = async (ticker: string) => {
  try {
    // First try to fetch the external data
    let companyProfile, companyPeers;
    try {
      [companyProfile, companyPeers] = await Promise.all([
        fetchCompanyProfile(ticker),
        fetchCompanyPeers(ticker),
      ]);
    } catch (error) {
      console.error("Failed to fetch company data:", error);
      return { error: true, message: "Failed to fetch company data" };
    }

    // Then try to insert into database
    try {
      const [inserted] = await db
        .insert(companies)
        .values({
          name: companyProfile.companyName,
          ticker,
          industry: companyProfile.industry,
          sector: companyProfile.sector,
          profile: companyProfile,
          peers: companyPeers,
        })
        .returning({ id: companies.id });

      return { error: false, message: "Company created", id: inserted.id };
    } catch (error) {
      console.error("Failed to insert company:", error);
      return { error: true, message: "Failed to save company to database" };
    }
  } catch (error) {
    // Catch any other unexpected errors
    console.error("Unexpected error:", error);
    return { error: true, message: "An unexpected error occurred" };
  }
};

export const deleteCompany = async (id: string) => {
  try {
    await db.delete(companies).where(eq(companies.id, id));
    return { error: false, message: "Company deleted" };
  } catch (error) {
    console.error(error);
    return { error: true, message: "Failed to delete company" };
  }
};

export const getOrCreateCompany = async (symbol: string) => {
  const company = await db.query.companies.findFirst({
    where: eq(companies.ticker, symbol.toUpperCase()),
  });
  if (!company) {
    await createCompany(symbol.toUpperCase());
  }
  return company;
};
