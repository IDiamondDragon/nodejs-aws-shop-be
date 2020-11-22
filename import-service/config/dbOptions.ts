const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

export const dbOptions = {
    host: PG_HOST,
    port: PG_PORT as unknown as number,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillies: 5000
  }