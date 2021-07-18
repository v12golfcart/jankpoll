const { Pool } = require("pg");
const { DATABASE_URL } = require("../config/environment");

const pool = new Pool({
  // user: PGUSER,
  // database: PGDATABASE,
  connectionString: DATABASE_URL,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});

// error handling for idle clients
pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

pool.on("notice", (msg) => {
  console.log("NOTICE", msg);
});

module.exports = {
  pool,
};
