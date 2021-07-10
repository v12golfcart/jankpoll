const { DEV_ENVIRONMENT, PORT, JWT_SECRET } = process.env;
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
};

module.exports = environment;
