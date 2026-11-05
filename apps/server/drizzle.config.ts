import { resolve } from "node:path";
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/database/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});