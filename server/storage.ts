import { users, ttsTests, type User, type InsertUser, type TtsTest, type InsertTtsTest } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getTtsTest(id: string): Promise<TtsTest | undefined>;
  createTtsTest(test: InsertTtsTest): Promise<TtsTest>;
  updateTtsTest(id: string, updates: Partial<TtsTest>): Promise<TtsTest | undefined>;
  getRecentTtsTests(limit?: number): Promise<TtsTest[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getTtsTest(id: string): Promise<TtsTest | undefined> {
    const [test] = await db.select().from(ttsTests).where(eq(ttsTests.id, id));
    return test || undefined;
  }

  async createTtsTest(insertTest: InsertTtsTest): Promise<TtsTest> {
    const [test] = await db
      .insert(ttsTests)
      .values(insertTest)
      .returning();
    return test;
  }

  async updateTtsTest(id: string, updates: Partial<TtsTest>): Promise<TtsTest | undefined> {
    const [updated] = await db
      .update(ttsTests)
      .set(updates)
      .where(eq(ttsTests.id, id))
      .returning();
    return updated || undefined;
  }

  async getRecentTtsTests(limit: number = 10): Promise<TtsTest[]> {
    const tests = await db
      .select()
      .from(ttsTests)
      .orderBy(desc(ttsTests.createdAt))
      .limit(limit);
    return tests;
  }
}

export const storage = new DatabaseStorage();
