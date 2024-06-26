import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  markdown: text("markdown"),
  summary: text("summary"),
  outline: text("outline"),
  questions: text("questions"),
  takeaways: text("takeaways"),
  pdfUrl: varchar("pdf_url", { length: 512 }),
  pdfSize: varchar("pdf_size", { length: 32 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
