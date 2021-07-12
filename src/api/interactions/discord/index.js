const express = require("express");
const router = express.Router();
const verificationCheck = require("./verificationCheck.js");
// const authenticationCheck = require("./authenticationCheck.js");
require("../../../utils").endpointTestRoute(router);

// verification
router.use(verificationCheck);
// router.use(authenticationCheck);

// clean and process the command
router.post("/", (req, res) => {
  const body = req.body;
  let command;
  if (
    body.data.component_type === 2 &&
    body.data.custom_id &&
    body.data.custom_id.match("poll")
  )
    command = "poll-action";
  else
    command =
      body.data.name === "create"
        ? "create-" + body.data.options[0].name
        : body.data.name;

  // route command
  switch (command) {
    case "help":
      require("./commandHelp")(req, res);
      break;
    case "create-poll":
      require("./commandCreatePoll")(req, res);
      break;
    case "poll-action":
      require("./commandPollAction")(req, res);
      break;
    default:
      res.send("Unknown command");
  }
});

router.get("/create/help");

module.exports = router;
