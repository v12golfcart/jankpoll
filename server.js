const express = require("express");
const favicon = require("express-favicon");
const path = require("path");
const { port, devEnv, JWTsecret } = require("./src/config/environment");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { reqTestMessage, endpointTestRoute } = require("./src/utils");

/* ++++++++++++++++++++++++
Initialize services
++++++++++++++++++++++++ */
const app = express();

/* ++++++++++++++++++++++++
Middleware
++++++++++++++++++++++++ */
endpointTestRoute(app);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(JWTsecret));

// the __dirname is the current directory from where the script is running
app.use(favicon(__dirname + "/build/favicon.ico"));

// authenticate requests with user
app.use(async (req, res, next) => {
  const user = {};
  req.user = user;
  next();
});

// dev logging
app.use((req, res, next) => {
  if (devEnv === "development") {
    console.log(reqTestMessage(req));
  }
  next();
});

/* ++++++++++++++++++++++++
Routes
++++++++++++++++++++++++ */
app.use("/api/", require("./src/api"));

/* ++++++++++++++++++++++++
App
++++++++++++++++++++++++ */

// if (process.env.devEnv === "production") {
app.use(express.static(__dirname));
// Serve any static files
app.use(express.static(path.join(__dirname, "build")));
// Handle React routing, return all requests to React app
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
// }
console.log(`Server listening on port ${port}.`);
app.listen(port);
