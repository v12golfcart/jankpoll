const express = require("express");
const router = express.Router();
const verificationCheck = require("./verificationCheck.js");
// const authenticationCheck = require("./authenticationCheck.js");
require("../../../utils").endpointTestRoute(router);

// verification
router.use(verificationCheck);
// router.use(authenticationCheck);

router.post("/", (req, res) => {
  const body = req.body;
  const command = body.data.name;

  // handling command
  switch (command) {
    case "help":
      require("./commandHelp")(req, res);
      break;
    default:
      res.send("Unknown command");
  }
});

router.get("/create/help");

module.exports = router;
