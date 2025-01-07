import {
  pgTable,
  text,
  boolean,
  uuid,
  timestamp,
  date,
  decimal,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";
import {
  FinancialStatementPeriod,
  IncomeStatement,
  BalanceSheet,
  CashFlowStatement,
} from "@/types";
import { relations } from "drizzle-orm";

export const todos = pgTable("todos", {
  id: uuid("id").primaryKey().defaultRandom(),
  text: text("text").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  ticker: text("ticker").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dashboards = pgTable(
  "dashboards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    companyId: uuid("company_id")
      .references(() => companies.id)
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
    companyId: uuid("company_id").references(() => companies.id),
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

export const balanceSheets = pgTable("balance_sheets", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id),
  date: date("date").notNull(),
  period: text("period").$type<FinancialStatementPeriod>().notNull(),
  data: jsonb("data").$type<BalanceSheet>().notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const incomeStatements = pgTable("income_statements", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id),
  date: date("date").notNull(),
  period: text("period").$type<FinancialStatementPeriod>().notNull(),
  data: jsonb("data").$type<IncomeStatement>().notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const cashFlowStatements = pgTable("cash_flow_statements", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id),
  date: date("date").notNull(),
  period: text("period").$type<FinancialStatementPeriod>().notNull(),
  data: jsonb("data").$type<CashFlowStatement>().notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const dashboardsRelations = relations(dashboards, ({ one }) => ({
  company: one(companies, {
    fields: [dashboards.companyId],
    references: [companies.id],
  }),
}));

export const companiesRelations = relations(companies, ({ many }) => ({
  dashboards: many(dashboards),
}));
