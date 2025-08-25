import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const ttsTests = pgTable("tts_tests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  text: text("text").notNull(),
  apiProvider: text("api_provider").notNull(),
  voiceSettings: jsonb("voice_settings").default({}),
  audioUrl: text("audio_url"),
  status: text("status").notNull().default("pending"), // pending, success, failed
  errorMessage: text("error_message"),
  generationTime: integer("generation_time"), // in milliseconds
  audioSize: integer("audio_size"), // in bytes
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTtsTestSchema = createInsertSchema(ttsTests).pick({
  text: true,
  apiProvider: true,
  voiceSettings: true,
});

export const ttsApiProviders = [
  "openai",
  "grok", 
  "groc",
  "azure",
  "google",
  "aws",
  "elevenlabs"
] as const;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type TtsTest = typeof ttsTests.$inferSelect;
export type InsertTtsTest = z.infer<typeof insertTtsTestSchema>;
export type TtsApiProvider = typeof ttsApiProviders[number];
