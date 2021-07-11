const express = require("express");
const router = express.Router();
require("../../utils").endpointTestRoute(router);

/* ++++++++++++++++++++++++
Routes
++++++++++++++++++++++++ */
router.use("/discord/", require("./discord"));
router.use("/discordCommands", require("./discord/createCommands"));

/* ++++++++++++++++++++++++
Other
++++++++++++++++++++++++ */

module.exports = router;
