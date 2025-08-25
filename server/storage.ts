import { type User, type InsertUser, type TtsTest, type InsertTtsTest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getTtsTest(id: string): Promise<TtsTest | undefined>;
  createTtsTest(test: InsertTtsTest): Promise<TtsTest>;
  updateTtsTest(id: string, updates: Partial<TtsTest>): Promise<TtsTest | undefined>;
  getRecentTtsTests(limit?: number): Promise<TtsTest[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private ttsTests: Map<string, TtsTest>;

  constructor() {
    this.users = new Map();
    this.ttsTests = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTtsTest(id: string): Promise<TtsTest | undefined> {
    return this.ttsTests.get(id);
  }

  async createTtsTest(insertTest: InsertTtsTest): Promise<TtsTest> {
    const id = randomUUID();
    const test: TtsTest = {
      ...insertTest,
      id,
      audioUrl: null,
      status: "pending",
      errorMessage: null,
      generationTime: null,
      audioSize: null,
      createdAt: new Date(),
    };
    this.ttsTests.set(id, test);
    return test;
  }

  async updateTtsTest(id: string, updates: Partial<TtsTest>): Promise<TtsTest | undefined> {
    const existing = this.ttsTests.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.ttsTests.set(id, updated);
    return updated;
  }

  async getRecentTtsTests(limit: number = 10): Promise<TtsTest[]> {
    const tests = Array.from(this.ttsTests.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
    return tests;
  }
}

export const storage = new MemStorage();
