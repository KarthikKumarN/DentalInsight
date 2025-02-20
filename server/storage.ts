import { searches, type Search, type InsertSearch } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createSearch(search: InsertSearch): Promise<Search>;
  getSearchByQuery(query: string): Promise<Search | undefined>;
  getAllSearches(): Promise<Search[]>;
}

export class DatabaseStorage implements IStorage {
  async createSearch(insertSearch: InsertSearch): Promise<Search> {
    const [search] = await db
      .insert(searches)
      .values(insertSearch)
      .returning();
    return search;
  }

  async getSearchByQuery(query: string): Promise<Search | undefined> {
    const [search] = await db
      .select()
      .from(searches)
      .where(eq(searches.query, query.toLowerCase()));
    return search;
  }

  async getAllSearches(): Promise<Search[]> {
    return await db.select().from(searches);
  }
}

export const storage = new DatabaseStorage();