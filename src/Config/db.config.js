import { Pool } from "pg";
import { config } from "dotenv";
config();

export class DbConfig {
  constructor() {
    this.pool = new Pool({
      connectionString: "postgres://bwnvpikv:g7hps5lXqZX3GU__prU1W9wo2sZe7P99@john.db.elephantsql.com/bwnvpikv",

    });
  }

  getPool() {
    return this.pool;
  }
}
