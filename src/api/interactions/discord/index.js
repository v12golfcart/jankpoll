const express = require("express");
const router = express.Router();
// const verificationCheck = require("./verificationCheck.js");
// const authenticationCheck = require("./authenticationCheck.js");
require("../../../utils").endpointTestRoute(router);

// verification
// router.use(verificationCheck);
// router.use(authenticationCheck);

// router.post("/", (req, res) => {
//   const body = req.body;
//   const command = body.data.name;

// handling command
//   switch (command) {
//     case "repeat":
//       require("./commandRepeat")(req, res);
//       break;
//     case "calendars":
//       require("./commandCalendars")(req, res);
//       break;
//     case "today":
//       require("./commandToday")(req, res);
//       break;
//     default:
//       res.send("Unknown command");
//   }
// });

module.exports = router;
