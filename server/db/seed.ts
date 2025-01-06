import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import "dotenv/config";

import {
  fetchBalanceSheets,
  fetchCashFlowStatements,
  fetchHistoricalData,
  fetchIncomeStatements,
} from "../actions/financials";
import { eq } from "drizzle-orm";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not defined");
}

// Create the neon client correctly
const sql = neon(process.env.POSTGRES_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  const companyName = "Tesla Inc.";
  const companyTicker = "TSLA";

  console.log("seeding the database");
  try {
    await seedFinancialStatements(companyName, companyTicker);
    console.log("successfully seeded financial statements");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
  process.exit(0);
}

seed();

async function getOrCreateCompany(companyName: string, companyTicker: string) {
  let [company] = await db
    .select()
    .from(schema.companies)
    .where(eq(schema.companies.ticker, companyTicker))
    .limit(1);

  if (!company) {
    [company] = await db
      .insert(schema.companies)
      .values([
        {
          name: companyName,
          ticker: companyTicker,
          status: "success",
        },
      ])
      .returning();
  }

  return company;
}

async function seedStockData(companyName: string, companyTicker: string) {
  const company = await getOrCreateCompany(companyName, companyTicker);

  const historicalData = await fetchHistoricalData(companyTicker, "2024-01-01");

  if (!historicalData) {
    throw new Error("Failed to fetch historical data");
  }

  // delete existing historical prices for this company
  await db
    .delete(schema.historicalPrices)
    .where(eq(schema.historicalPrices.companyId, company.id));

  // insert new historical prices
  await db.insert(schema.historicalPrices).values(
    historicalData.map((data: any) => ({
      companyId: company.id,
      date: data.date,
      price: data.price,
      updatedAt: new Date(),
    })),
  );

  console.log("Seed completed successfully");
}

async function seedFinancialStatements(
  companyName: string,
  companyTicker: string,
) {
  const company = await getOrCreateCompany(companyName, companyTicker);

  // delete existing statements
  await db
    .delete(schema.balanceSheets)
    .where(eq(schema.balanceSheets.companyId, company.id));

  await db
    .delete(schema.incomeStatements)
    .where(eq(schema.incomeStatements.companyId, company.id));

  await db
    .delete(schema.cashFlowStatements)
    .where(eq(schema.cashFlowStatements.companyId, company.id));

  const balanceSheets = await fetchBalanceSheets(company.ticker);
  const incomeStatements = await fetchIncomeStatements(company.ticker);
  const cashFlowStatements = await fetchCashFlowStatements(company.ticker);

  const formattedBalanceSheets = balanceSheets.map((data: any) => ({
    companyId: company.id,
    date: data.date,
    data: data,
    period: "quarterly",
    updatedAt: new Date(),
  }));

  const formattedIncomeStatements = incomeStatements.map((data: any) => ({
    companyId: company.id,
    date: data.date,
    data: data,
    period: "quarterly",
    updatedAt: new Date(),
  }));

  const formattedCashFlowStatements = cashFlowStatements.map((data: any) => ({
    companyId: company.id,
    date: data.date,
    data: data,
    period: "quarterly",
    updatedAt: new Date(),
  }));

  await db.insert(schema.balanceSheets).values(formattedBalanceSheets);
  await db.insert(schema.incomeStatements).values(formattedIncomeStatements);
  await db
    .insert(schema.cashFlowStatements)
    .values(formattedCashFlowStatements);
}
