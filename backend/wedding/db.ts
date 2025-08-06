import { SQLDatabase } from "encore.dev/storage/sqldb";

export const weddingDB = new SQLDatabase("wedding", {
  migrations: "./migrations",
});
