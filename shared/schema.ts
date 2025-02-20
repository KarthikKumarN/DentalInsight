import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const searches = pgTable("searches", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  response: jsonb("response").notNull(),
  timestamp: text("timestamp").notNull()
});

export const searchResponseSchema = z.object({
  description: z.string(),
  treatments: z.array(z.string()),
  medicines: z.array(z.string()),
  diagnosticSteps: z.array(z.object({
    step: z.string(),
    description: z.string(),
    warning: z.string().optional(),
    severity: z.enum(["low", "medium", "high"]).optional()
  })),
  references: z.array(z.object({
    title: z.string(),
    url: z.string()
  })),
  imageUrl: z.string(),
  imageCredit: z.string(),
  sourceAttribution: z.string()
});

export const insertSearchSchema = createInsertSchema(searches).pick({
  query: true,
  response: true,
  timestamp: true
});

export type SearchResponse = z.infer<typeof searchResponseSchema>;
export type InsertSearch = z.infer<typeof insertSearchSchema>;
export type Search = typeof searches.$inferSelect;