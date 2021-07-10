const express = require("express");
const router = express.Router();
require("../utils").endpointTestRoute(router);
/* ++++++++++++++++++++++++
Other Routes
++++++++++++++++++++++++ */
// router.use("/auth/", require("./auth"));

// cookie test
router.get("/setcookie", (req, res) => {
  let val = req.query.cookie || "NOTHING!";
  res.cookie("testCookie", val, {
    maxAge: 60 * 60 * 1000, // 1 hour
    secure: true,
    httpOnly: true,
    signed: false,
  });
  res.cookie("testCookieSigned", val, {
    maxAge: 60 * 60 * 1000, // 1 hour
    secure: true,
    httpOnly: true,
    signed: true,
  });

  res.send(`the cookie you've set is ${val}`);
});

router.get("/clearcookie", (req, res) => {
  res.clearCookie("testCookie");
  res.clearCookie("testCookieSigned");
  res.send("cookie cleared");
});

/* ++++++++++++++++++++++++
Other
++++++++++++++++++++++++ */
module.exports = router;
