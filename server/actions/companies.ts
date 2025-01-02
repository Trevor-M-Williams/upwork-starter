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
