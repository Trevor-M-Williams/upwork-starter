"use server";

import { db } from "@/server/db";
import { companies } from "@/server/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getCompany = async (id: string) => {
  return await db.query.companies.findFirst({
    where: eq(companies.id, id),
  });
};

export const getCompanies = async () => {
  return await db.select().from(companies).orderBy(asc(companies.createdAt));
};

export const createCompany = async (name: string, ticker: string) => {
  try {
    await db.insert(companies).values({ name, ticker });
    revalidatePath("/dashboard/companies");
    getCompanyFinancialData(ticker);
    return { error: false, message: "Company created" };
  } catch (error) {
    console.error(error);
    return { error: true, message: "Failed to create company" };
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

export const getCompanyFinancialData = async (ticker: string) => {
  console.log("Getting financial data for", ticker);
  try {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const revenue = Math.floor(Math.random() * 1000000);
    await db
      .update(companies)
      .set({ revenue, status: "success" })
      .where(eq(companies.ticker, ticker));
    console.log("Financial data fetched for", ticker);
  } catch (error) {
    console.error(error);
    await db
      .update(companies)
      .set({ status: "error" })
      .where(eq(companies.ticker, ticker));
  }
};
