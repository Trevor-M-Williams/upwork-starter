"use server";

import { asc, eq, gte, sql } from "drizzle-orm";
import {
  BalanceSheetData,
  CashFlowStatementData,
  IncomeStatementData,
  StockAPIData,
} from "@/types";
import { db } from "@/server/db";
import {
  historicalPrices,
  companies,
  balanceSheets as balanceSheetsTable,
  incomeStatements as incomeStatementsTable,
  cashFlowStatements as cashFlowStatementsTable,
  sp500Historical,
} from "@/server/db/schema";
import { getOrCreateCompany } from "@/server/actions/companies";

export async function getSp500HistoricalData(startDate: string) {
  const historicalData = await db.query.sp500Historical.findMany({
    where: gte(sp500Historical.date, startDate),
    orderBy: asc(sp500Historical.date),
  });
  return historicalData;
}

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
      .where(
        sql`${historicalPrices.companyId} = ${company.id} 
        AND ${historicalPrices.date} >= ${new Date(startDate)}
        AND ${historicalPrices.date} <= ${new Date(endDate)}`,
      )
      .orderBy(asc(historicalPrices.date));

    // Check if we have any data and if the latest price is fresh
    if (prices.length > 0 && !calculateIsStale(prices[0].updatedAt, 1)) {
      return prices.map((p) => ({
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
          ticker: company.ticker,
          date: new Date(data.date),
          price: data.price,
          updatedAt: new Date(),
        })),
      )
      .onConflictDoNothing({
        target: [historicalPrices.companyId, historicalPrices.date],
      });

    return historicalData;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getBalanceSheets(symbol: string) {
  const company = await getOrCreateCompany(symbol);

  if (!company) {
    throw new Error("Failed to get/create company");
  }

  let balanceSheets = await db.query.balanceSheets.findMany({
    where: eq(balanceSheetsTable.companyId, company.id),
    orderBy: asc(balanceSheetsTable.date),
  });

  const latestBalanceSheet = balanceSheets[0];

  if (
    !balanceSheets.length ||
    !latestBalanceSheet ||
    calculateIsStale(latestBalanceSheet.updatedAt, 1)
  ) {
    const fetchedData = await fetchBalanceSheets(company.ticker);
    if (!fetchedData || fetchedData.length === 0) {
      return [];
    }

    // Transform the data before insertion
    balanceSheets = fetchedData.map((statement: BalanceSheetData) => ({
      companyId: company.id,
      period: statement.period,
      date: statement.date,
      data: statement,
      updatedAt: new Date(),
    }));

    if (balanceSheets.length > 0) {
      await db
        .insert(balanceSheetsTable)
        .values(balanceSheets)
        .onConflictDoNothing({
          target: [balanceSheetsTable.companyId, balanceSheetsTable.date],
        });
    }
  }

  // Sort by date in ascending order (oldest first)
  return balanceSheets.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

export async function getIncomeStatements(symbol: string) {
  const company = await getOrCreateCompany(symbol);

  if (!company) {
    throw new Error("Failed to get/create company");
  }

  let incomeStatements = await db.query.incomeStatements.findMany({
    where: eq(incomeStatementsTable.companyId, company.id),
    orderBy: asc(incomeStatementsTable.date),
  });

  const latestIncomeStatement = incomeStatements[0];

  if (
    !incomeStatements.length ||
    !latestIncomeStatement ||
    calculateIsStale(latestIncomeStatement.updatedAt, 1)
  ) {
    const fetchedData = await fetchIncomeStatements(company.ticker);
    if (!fetchedData || fetchedData.length === 0) {
      return [];
    }

    // Transform the data before insertion
    incomeStatements = fetchedData
      .map((statement: IncomeStatementData) => {
        // found some bad data so we're calculating the operating income ratio manually
        const operatingIncomeRatio =
          statement.operatingIncome / statement.revenue;

        statement.operatingIncomeRatio = operatingIncomeRatio;
        return {
          companyId: company.id,
          period: statement.period,
          date: statement.date,
          data: statement,
          updatedAt: new Date(),
        };
      })
      .filter((statement: IncomeStatementData) => statement != null);

    if (incomeStatements.length > 0) {
      await db
        .insert(incomeStatementsTable)
        .values(incomeStatements)
        .onConflictDoNothing({
          target: [incomeStatementsTable.companyId, incomeStatementsTable.date],
        });
    }
  }

  // Sort by date in ascending order (oldest first)
  return incomeStatements.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

export async function getCashFlowStatements(symbol: string) {
  const company = await getOrCreateCompany(symbol);

  if (!company) {
    throw new Error("Failed to get/create company");
  }

  let cashFlowStatements = await db.query.cashFlowStatements.findMany({
    where: eq(cashFlowStatementsTable.companyId, company.id),
    orderBy: asc(cashFlowStatementsTable.date),
  });

  const latestCashFlowStatement = cashFlowStatements[0];

  if (
    !cashFlowStatements.length ||
    !latestCashFlowStatement ||
    calculateIsStale(latestCashFlowStatement.updatedAt, 1)
  ) {
    const fetchedData = await fetchCashFlowStatements(company.ticker);
    if (!fetchedData || fetchedData.length === 0) {
      return [];
    }

    // Transform the data before insertion
    cashFlowStatements = fetchedData.map(
      (statement: CashFlowStatementData) => ({
        companyId: company.id,
        period: statement.period,
        date: statement.date,
        data: statement,
        updatedAt: new Date(),
      }),
    );

    if (cashFlowStatements.length > 0) {
      await db
        .insert(cashFlowStatementsTable)
        .values(cashFlowStatements)
        .onConflictDoNothing({
          target: [
            cashFlowStatementsTable.companyId,
            cashFlowStatementsTable.date,
          ],
        });
    }
  }

  // Sort by date in ascending order (oldest first)
  return cashFlowStatements.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
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
        date: item.date,
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

export async function fetchCompanyPeers(symbol: string) {
  try {
    const url = `https://financialmodelingprep.com/api/v4/stock_peers?symbol=${symbol}&apikey=${process.env.STOCK_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data?.[0]?.peersList) {
      throw new Error("Invalid peers data format");
    }

    return data[0].peersList;
  } catch (error) {
    console.error(`Failed to fetch peers for ${symbol}:`, error);
    return [];
  }
}

export async function fetchCompanyProfile(symbol: string) {
  try {
    const url = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${process.env.STOCK_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data?.[0]) {
      throw new Error(`No profile data found for ${symbol}`);
    }

    return data[0];
  } catch (error) {
    console.error(`Failed to fetch profile for ${symbol}:`, error);
    throw error; // Re-throw because this is required data for company creation
  }
}

export async function fetchFullQuote(symbol: string) {
  const url = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${process.env.STOCK_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data[0];
}

export async function fetchCompanyMetrics(symbol: string) {
  const url = `https://financialmodelingprep.com/api/v3/key-metrics-ttm/${symbol}?apikey=${process.env.STOCK_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (!data?.[0]) {
    throw new Error(`No profile data found for ${symbol}`);
  }

  return data[0];
}

// ------------- Helper functions ------------- //

function calculateIsStale(updatedAt: Date, stalePeriodInDays: number) {
  const updatedAtDate = new Date(updatedAt);
  const currentDate = new Date();

  const stalePeriodDate = new Date(
    currentDate.getTime() - stalePeriodInDays * 24 * 60 * 60 * 1000,
  );

  return updatedAtDate < stalePeriodDate;
}

export async function getStockPrice(ticker: string) {
  //testing tool use in api/chat/route.ts
  try {
    const quote = await fetchFullQuote(ticker);
    if (!quote) {
      throw new Error(`No quote data found for ${ticker}`);
    }

    return quote.price;
  } catch (error) {
    console.error(`Error fetching stock price for ${ticker}:`, error);
    throw new Error(`Failed to fetch stock price for ${ticker}`);
  }
}
