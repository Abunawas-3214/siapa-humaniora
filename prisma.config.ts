import path from "node:path";
import { defineConfig } from "prisma/config";

process.loadEnvFile()

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
//   views: {
//     path: path.join("db", "views"),
//   },
//   typedSql: {
//     path: path.join("db", "queries"),
//   }
});