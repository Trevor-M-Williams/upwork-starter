"use server";

import { asc, eq, sql } from "drizzle-orm";
import { StockAPIData } from "@/types";
import { db } from "@/server/db";
import {
  historicalPrices,
  companies,
  balanceSheets,
  incomeStatements,
  cashFlowStatements,
} from "@/server/db/schema";

export async function getHistoricalData(
  ticker: string,
  startDate: string,
  endDate = new Date().toISOString(),
) {
  try {
    const company = await db.query.companies.findFirst({
      where: eq(companies.ticker, ticker.toUpperCase()),
    });

    if (!company) {
      throw new Error("Company not found");
    }

    // Single DB query to get all prices
    const prices = await db
      .select()
      .from(historicalPrices)
      .where(eq(historicalPrices.companyId, company.id))
      .orderBy(asc(historicalPrices.date));

    // Check if we have any data and if the latest price is fresh
    if (prices.length > 0 && !calculateIsStale(prices[0].updatedAt, 1)) {
      // Filter dates in memory
      const filteredPrices = prices.filter((p) => {
        const priceDate = new Date(p.date);
        return (
          priceDate >= new Date(startDate) && priceDate <= new Date(endDate)
        );
      });

      return filteredPrices.map((p) => ({
        date: new Date(p.date).toISOString().split("T")[0],
        price: Number(p.price),
      }));
    }

    // Otherwise fetch new data
    const historicalData = await fetchHistoricalData(
      company.ticker,
      startDate,
      endDate,
    );

    await db
      .insert(historicalPrices)
      .values(
        historicalData.map((data: { date: string; price: number }) => ({
          companyId: company.id,
          date: new Date(data.date),
          price: data.price,
          updatedAt: new Date(),
        })),
      )
      .onConflictDoUpdate({
        target: [historicalPrices.companyId, historicalPrices.date],
        set: { price: sql`EXCLUDED.price`, updatedAt: sql`NOW()` },
      });

    return historicalData;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getBalanceSheets(ticker: string) {
  const balanceSheetData = await db.query.balanceSheets.findMany({
    where: eq(balanceSheets.companyId, ticker),
    orderBy: asc(balanceSheets.date),
  });

  const latestBalanceSheet = balanceSheetData[0];

  if (
    !balanceSheetData.length ||
    !latestBalanceSheet ||
    calculateIsStale(latestBalanceSheet.updatedAt, 1)
  ) {
    const balanceSheetData = await fetchBalanceSheets(ticker);
    await db.insert(balanceSheets).values(balanceSheetData);
  }

  return balanceSheetData;
}

export async function getIncomeStatements(companyId: string) {
  const company = await db.query.companies.findFirst({
    where: eq(companies.id, companyId),
  });

  if (!company) {
    throw new Error("Company not found");
  }

  const incomeStatementData = await db.query.incomeStatements.findMany({
    where: eq(incomeStatements.companyId, companyId),
    orderBy: asc(incomeStatements.date),
  });

  const latestIncomeStatement = incomeStatementData[0];

  if (
    !incomeStatementData.length ||
    !latestIncomeStatement ||
    calculateIsStale(latestIncomeStatement.updatedAt, 1)
  ) {
    const incomeStatementData = await fetchIncomeStatements(company.ticker);
    await db.insert(incomeStatements).values(incomeStatementData);
  }

  return incomeStatementData;
}

export async function getCashFlowStatements(companyId: string) {
  const company = await db.query.companies.findFirst({
    where: eq(companies.id, companyId),
  });

  if (!company) {
    throw new Error("Company not found");
  }

  const cashFlowStatementData = await db.query.cashFlowStatements.findMany({
    where: eq(cashFlowStatements.companyId, companyId),
    orderBy: asc(cashFlowStatements.date),
  });

  const latestCashFlowStatement = cashFlowStatementData[0];

  if (
    !cashFlowStatementData.length ||
    !latestCashFlowStatement ||
    calculateIsStale(latestCashFlowStatement.updatedAt, 1)
  ) {
    const cashFlowStatementData = await fetchCashFlowStatements(company.ticker);
    await db.insert(cashFlowStatements).values(cashFlowStatementData);
  }

  return cashFlowStatementData;
}

// ------------- Data fetching ------------- //

export async function fetchHistoricalData(
  ticker: string,
  startDate: string,
  endDate = new Date().toISOString(),
) {
  try {
    const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?apikey=${process.env.STOCK_API_KEY}&from=${startDate}&to=${endDate}`;
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const stockData = data.historical
      .map((item: StockAPIData) => ({
        date: formatDate(item.date),
        price: item.close,
      }))
      .reverse();

    return stockData;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchBalanceSheets(symbol: string) {
  const url = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${symbol}?period=quarterly&apikey=${process.env.STOCK_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function fetchCashFlowStatements(symbol: string) {
  const url = `https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?period=quarterly&apikey=${process.env.STOCK_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function fetchIncomeStatements(symbol: string) {
  const url = `https://financialmodelingprep.com/api/v3/income-statement/${symbol}?period=quarterly&apikey=${process.env.STOCK_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function fetchStockPeers(symbol: string) {
  const url = `https://financialmodelingprep.com/api/v4/stock_peers?symbol=${symbol}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function fetchFullQuote(symbol: string) {
  const url = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${process.env.STOCK_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data[0];
}

// ------------- Helper functions ------------- //

function calculateIsStale(updatedAt: Date, stalePeriodInDays: number): boolean {
  const updatedAtDate = new Date(updatedAt);
  const currentDate = new Date();

  const stalePeriodDate = new Date(
    currentDate.getTime() - stalePeriodInDays * 24 * 60 * 60 * 1000,
  );

  return updatedAtDate < stalePeriodDate;
}

function formatDate(dateStr: string): string {
  const dateObj = new Date(dateStr);
  const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear().toString().slice(2)}`;
  return formattedDate;
}
