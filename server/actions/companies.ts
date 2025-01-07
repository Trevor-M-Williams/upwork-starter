"use server";

import { db } from "@/server/db";
import { companies } from "@/server/db/schema";
import { eq, asc } from "drizzle-orm";

export const getCompany = async (id: string) => {
  return await db.query.companies.findFirst({
    where: eq(companies.id, id),
  });
};

export const createCompany = async (name: string, ticker: string) => {
  try {
    await db.insert(companies).values({ name, ticker });
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

export async function fetchCompanyProfile(symbol: string) {
  const url = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${process.env.STOCK_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  return data[0];
}
