import {
  pgTable,
  text,
  uuid,
  timestamp,
  date,
  decimal,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";
import {
  FinancialStatementPeriod,
  IncomeStatementData,
  BalanceSheetData,
  CashFlowStatementData,
  CompanyProfile,
} from "@/types";
import { relations } from "drizzle-orm";

export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticker: text("ticker").notNull().unique(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  sector: text("sector").notNull(),
  profile: jsonb("profile").$type<CompanyProfile>().notNull(),
  peers: jsonb("peers").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dashboards = pgTable(
  "dashboards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    companyId: uuid("company_id")
      .references(() => companies.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      dashboardIdx: uniqueIndex("dashboard_idx").on(
        table.userId,
        table.companyId,
      ),
    };
  },
);

export const historicalPrices = pgTable(
  "historical_prices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .references(() => companies.id, { onDelete: "cascade" })
      .notNull(),
    date: date("date").notNull(),
    price: decimal("price", { precision: 15, scale: 4 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      dateIdx: uniqueIndex("historical_price_date_idx").on(
        table.companyId,
        table.date,
      ),
    };
  },
);

export const balanceSheets = pgTable(
  "balance_sheets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .references(() => companies.id, { onDelete: "cascade" })
      .notNull(),
    date: date("date").notNull(),
    period: text("period").$type<FinancialStatementPeriod>().notNull(),
    data: jsonb("data").$type<BalanceSheetData>().notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    dateIdx: uniqueIndex("balance_sheet_date_idx").on(
      table.companyId,
      table.date,
    ),
  }),
);

export const incomeStatements = pgTable(
  "income_statements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .references(() => companies.id, { onDelete: "cascade" })
      .notNull(),
    date: date("date").notNull(),
    period: text("period").$type<FinancialStatementPeriod>().notNull(),
    data: jsonb("data").$type<IncomeStatementData>().notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    dateIdx: uniqueIndex("income_statement_date_idx").on(
      table.companyId,
      table.date,
    ),
  }),
);

export const cashFlowStatements = pgTable(
  "cash_flow_statements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("company_id")
      .references(() => companies.id, { onDelete: "cascade" })
      .notNull(),
    date: date("date").notNull(),
    period: text("period").$type<FinancialStatementPeriod>().notNull(),
    data: jsonb("data").$type<CashFlowStatementData>().notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    dateIdx: uniqueIndex("cash_flow_statement_date_idx").on(
      table.companyId,
      table.date,
    ),
  }),
);

export const sp500Historical = pgTable(
  "sp500_historical",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    date: date("date").notNull(),
    price: decimal("price", { precision: 15, scale: 4 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    dateIdx: uniqueIndex("sp500_historical_date_idx").on(table.date),
  }),
);

export const dashboardsRelations = relations(dashboards, ({ one }) => ({
  company: one(companies, {
    fields: [dashboards.companyId],
    references: [companies.id],
  }),
}));

export const companiesRelations = relations(companies, ({ many }) => ({
  dashboards: many(dashboards),
}));
