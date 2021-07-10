const reqTestMessage = (req) => [
  `+++++++++++++++++++++++++++++++++++++++++++++`,
  `${req.method}: ${req.baseUrl}${req.path}`,
  `query:`,
  req.query,
  `params:`,
  req.params,
  `body:`,
  req.body,
  `cookies:`,
  req.cookies,
  req.signedCookies,
  `authed user`,
  req.user,
];

const endpointTestRoute = (router) => {
  let message = (req) => `PONG! ${req.method}: ${req.baseUrl}${req.path}`;
  router.get("/ping", (req, res) => res.send(message(req)));
  router.post("/ping", (req, res) => res.send(message(req)));
};

const isoToPsql = (isoString) => isoString.replace(/T/g, " ").replace(/Z/g, "");
//.split(".")[0];

module.exports = {
  endpointTestRoute,
  reqTestMessage,
  isoToPsql,
};
