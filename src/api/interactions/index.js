const express = require("express");
const router = express.Router();
require("../../utils").endpointTestRoute(router);

/* ++++++++++++++++++++++++
Routes
++++++++++++++++++++++++ */
router.use("/discord/", require("./discord"));

/* ++++++++++++++++++++++++
Other
++++++++++++++++++++++++ */

module.exports = router;
