const {
  DEV_ENVIRONMENT,
  PORT,
  JWT_SECRET,
  DISCORD_CLIENT_ID,
  DISCORD_CILENT_SECRET,
  DISCORD_CLIENT_PUBLIC_KEY,
  DISCORD_BOT_TOKEN,
} = process.env;
let root = "https://jankpoll.ngrok.io";

const environment = {
  devEnv: DEV_ENVIRONMENT,
  // domain boiler plate
  apiURL: DEV_ENVIRONMENT === "production" ? root : `http://localhost:5000`,
  baseURL: DEV_ENVIRONMENT === "production" ? root : `http://localhost:3000`,
  port: DEV_ENVIRONMENT === "production" ? PORT : 5000,
  // JWT
  JWTsecret: JWT_SECRET,
  // google
  // discord
  DISCORD_CLIENT_ID,
  DISCORD_CILENT_SECRET,
  DISCORD_CLIENT_PUBLIC_KEY,
  DISCORD_BOT_TOKEN,
};

module.exports = environment;
