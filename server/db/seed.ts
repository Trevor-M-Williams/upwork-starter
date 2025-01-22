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
import { getOrCreateCompany } from "../actions/companies";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not defined");
}

// Create the neon client correctly
const sql = neon(process.env.POSTGRES_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  const companyTicker = "AAPL";

  console.log("seeding the database");
  try {
    await seedSp500Historical();
    console.log("successfully seeded sp500 historical data");

    // await seedFinancialStatements(companyTicker);
    // console.log("successfully seeded financial statements");

    // await seedStockData(companyTicker);
    // console.log("successfully seeded stock data");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
  process.exit(0);
}

seed();

async function seedSp500Historical() {
  const historicalData = await fetchHistoricalData("SPY", "2000-01-01");

  if (!historicalData) {
    throw new Error("Failed to fetch historical data");
  }

  await db.delete(schema.sp500Historical);

  await db.insert(schema.sp500Historical).values(historicalData);
}

async function seedStockData(companyTicker: string) {
  const company = await getOrCreateCompany(companyTicker);

  if (!company) {
    throw new Error("Company not found");
  }

  const historicalData = await fetchHistoricalData(companyTicker, "2024-01-01");

  if (!historicalData) {
    throw new Error("Failed to fetch historical data");
  }
  await db
    .delete(schema.historicalPrices)
    .where(eq(schema.historicalPrices.companyId, company.id));

  await db.insert(schema.historicalPrices).values(
    historicalData.map((data: any) => ({
      companyId: company.id,
      date: data.date,
      price: data.price,
      updatedAt: new Date(),
    })),
  );
}

async function seedFinancialStatements(companyTicker: string) {
  const company = await getOrCreateCompany(companyTicker);

  if (!company) {
    throw new Error("Company not found");
  }

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
