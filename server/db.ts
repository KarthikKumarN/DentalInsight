import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "@shared/schema";
import { DB_URL } from "./config";

neonConfig.webSocketConstructor = ws;

if (!DB_URL) {
	throw new Error(
		"DATABASE_URL must be set. Did you forget to provision a database?"
	);
}

export const pool = new Pool({
	connectionString: DB_URL,
});
export const db = drizzle({ client: pool, schema });
