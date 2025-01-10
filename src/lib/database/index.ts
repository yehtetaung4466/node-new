// import 'dotenv/config';
// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
// import * as schema from "./schema";

import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
config()

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL!,
// });
// export const db = drizzle({ client: pool,schema });
// export {schema}
const log:["query","error","info","warn"] | undefined = process.env.NODE_ENV === 'local' ? ["query","error","info","warn"]:undefined
export const db = new PrismaClient({
  log,
})

