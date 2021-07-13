/* ++++++++++++++++++++++++
General Utils
++++++++++++++++++++++++ */

/* ++++++++++++++++++++++++
API Utils
++++++++++++++++++++++++ */
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

/* ++++++++++++++++++++++++
DB/Model Utils
++++++++++++++++++++++++ */
const isoToPsql = (isoString) => isoString.replace(/T/g, " ").replace(/Z/g, "");

const mapTableToModel = {
  communities: "community",
  polls: "poll",
  choices: "choice",
  responses: "response",
  leaderboards: "leaderboard",
};

const dbLookup = async (
  pool,
  table,
  model,
  lookupCol,
  searchValue,
  findOne = true
) => {
  const client = await pool.connect();

  // build query
  const queryText = `SELECT * FROM ${table} WHERE ${lookupCol} = ${
    model[lookupCol] === "varchar" ? `'${searchValue}'` : searchValue
  }`;

  // send request
  try {
    console.log(
      `Looking for ${mapTableToModel[table]} ${searchValue} (${lookupCol})`
    );
    const res = await client.query(queryText);
    if (findOne && res.rowCount > 1) {
      throw new Error(
        `ERROR: Lookup found ${res.rowCount} records: ${res.rows.map(
          (i) => " " + i.email
        )}`
      );
    }
    const record = findOne ? res.rows[0] : res.rows;
    console.log(`Results for ${mapTableToModel[table]} lookup:`, record);
    return record;
  } catch (e) {
    console.error(
      `Error with lookup for ${mapTableToModel[table]}: `,
      e.message
    );
  } finally {
    client.release();
  }
};

const dbAddRecord = async (pool, table, model, payloadOjb, reqFieldsArray) => {
  // validation
  // (1) take the payload obj make sure all fields are in model and non-null
  const payloadOjbCleaned = Object.keys(payloadOjb)
    .filter(
      (i) => Object.keys(model).includes(i) && payloadOjb[i] !== undefined
    ) // only key/values in model
    .reduce((acc, key) => {
      return {
        ...acc,
        [key]: payloadOjb[key],
      };
    }, {}); // recombine in an obj
  // (2) make sure all required fields are present
  if (reqFieldsArray && reqFieldsArray.length > 0) {
    const missingFields = reqFieldsArray.filter(
      (i) => !Object.keys(payloadOjbCleaned).includes(i)
    );
    if (missingFields.length > 0)
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  // build query
  const client = await pool.connect();
  const queryText = `INSERT INTO ${table} (${Object.keys(
    payloadOjbCleaned
  ).join(", ")}) VALUES (${Object.keys(payloadOjbCleaned)
    .map((i) =>
      ["varchar", "timestamp"].includes(model[i])
        ? `'${payloadOjbCleaned[i]}'`
        : `${payloadOjbCleaned[i]}`
    )
    .join(", ")}) returning *`;

  // send request
  try {
    const res = await client.query(queryText);
    console.log(`Added ${mapTableToModel[table]}`, res.rows[0]);
    return res.rows[0];
  } catch (e) {
    console.error(`Error adding a record to ${table}: `, e.message);
  } finally {
    client.release();
  }
};

/* ++++++++++++++++++++++++
Export
++++++++++++++++++++++++ */

module.exports = {
  //general
  isoToPsql,
  //api
  endpointTestRoute,
  reqTestMessage,
  //db/models
  dbLookup,
  dbAddRecord,
};
