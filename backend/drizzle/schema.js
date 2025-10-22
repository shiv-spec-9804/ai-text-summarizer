import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const summaries = pgTable("summaries", {
  id: serial("id").primaryKey(),
  sender: text("sender").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  summary_text: text("summary_text").notNull(),
  category: text("category").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
