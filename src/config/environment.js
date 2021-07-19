const {
  NODE_ENV,
  PORT,
  JWT_SECRET,
  DISCORD_CLIENT_ID,
  DISCORD_CILENT_SECRET,
  DISCORD_CLIENT_PUBLIC_KEY,
  DISCORD_BOT_TOKEN,
  PGUSER,
  PGDATABASE,
  DATABASE_URL,
} = process.env;
let root = "http://www.jankpoll.com";

const env = NODE_ENV || "development";

const environment = {
  devEnv: env,
  // domain boiler plate
  apiURL: env === "production" ? root : `http://localhost:5000`,
  baseURL: env === "production" ? root : `http://localhost:3000`,
  port: env === "production" ? PORT : 5000,
  // JWT
  JWTsecret: JWT_SECRET,
  // google
  // discord
  DISCORD_CLIENT_ID,
  DISCORD_CILENT_SECRET,
  DISCORD_CLIENT_PUBLIC_KEY,
  DISCORD_BOT_TOKEN,
  // db
  PGUSER,
  PGDATABASE,
  DATABASE_URL,
};

module.exports = environment;
