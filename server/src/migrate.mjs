import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
const here = path.dirname(fileURLToPath(import.meta.url));
const migrationDir = path.resolve(here, "../migrations");

try {
  const files = (await fs.readdir(migrationDir)).filter((f) => f.endsWith(".sql")).sort();
  for (const file of files) {
    const sql = await fs.readFile(path.join(migrationDir, file), "utf8");
    await pool.query(sql);
    console.log(`applied ${file}`);
  }
} finally {
  await pool.end();
}
