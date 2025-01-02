import {
  pgTable,
  text,
  boolean,
  uuid,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { CompanyStatus } from "@/types";

export const todos = pgTable("todos", {
  id: uuid("id").primaryKey().defaultRandom(),
  text: text("text").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  ticker: text("ticker").notNull(),
  status: text("status").$type<CompanyStatus>().default("pending").notNull(),
  revenue: integer("revenue"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
