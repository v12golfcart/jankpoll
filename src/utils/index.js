const format = require("pg-format");

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
    const res = await client.query(queryText);
    if (findOne && res.rowCount > 1) {
      throw new Error(
        `ERROR: Lookup found ${res.rowCount} records: ${res.rows.map(
          (i) => " " + i.email
        )}`
      );
    }
    const record = findOne ? res.rows[0] : res.rows;
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

const dbAddRecord = async (pool, table, model, payloadArr, reqFieldsArray) => {
  const client = await pool.connect();

  try {
    // validation
    const validatePayloadItem = (payloadObj) => {
      // (1) take the payload obj make sure all fields are in model and non-null
      const payloadObjCleaned = Object.keys(payloadObj)
        .filter(
          (i) => Object.keys(model).includes(i) && payloadObj[i] !== undefined
        ) // only key/values in model
        .reduce((acc, key) => {
          return {
            ...acc,
            [key]: payloadObj[key],
          };
        }, {}); // recombine in an obj
      // (2) make sure all required fields are present
      if (reqFieldsArray && reqFieldsArray.length > 0) {
        const missingFields = reqFieldsArray.filter(
          (i) => !Object.keys(payloadObjCleaned).includes(i)
        );
        if (missingFields.length > 0)
          throw new Error(
            `Missing required fields: ${missingFields.join(", ")}`
          );
      }
      return payloadObjCleaned;
    };

    const payloadArrCleaned = payloadArr.map((i) => validatePayloadItem(i));

    // build query
    const cols = Object.keys(payloadArrCleaned[0]).join(", "); // chooses first value and builds cols; assumes they're all the same
    const values = payloadArrCleaned.map((i) => Object.values(i));
    const query = format(
      `INSERT INTO ${table} (${cols}) VALUES %L returning *`,
      values
    );

    // send request
    const res = await client.query(query);
    return res.rows;
  } catch (e) {
    console.error(`Error adding a record to ${table}: `, e.message);
  } finally {
    client.release();
  }
};

// const dbUpdateRecord = async (
//   pool,
//   table,
//   model,
//   colsArr,
//   valuesArr,
//   filterKey,
//   filterValue
// ) => {
//   const client = await pool.connect();
//   try {
//     // validate that cols are in the model
//     const badCols = colsArr.filter((i) => !Object.keys(model).includes(i));
//     if (badCols.length > 0)
//       throw new Error(
//         `Update includes columns (${badCols.join(
//           ", "
//         )}) not in the data model for ${table}`
//       );

//     // build query
//     const query = format(
//       `UPDATE ${table} SET (${colsArr.join(
//         ", "
//       )}) = (%L) WHERE ${filterKey} = %L returning *`,
//       valuesArr,
//       filterValue
//     );

//     // send request
//     const res = await client.query(query);
//     console.log(
//       `Updated ${table} where ${filterKey} = ${filterValue}`,
//       res.rows
//     );
//     return res.rows;
//   } catch (e) {
//     console.error(`Error updating a record in ${table}: `, e.message);
//   } finally {
//     client.release();
//   }
// };

/* ++++++++++++++++++++++++
Export
++++++++++++++++++++++++ */

module.exports = {
  //general
  isoToPsql,
  maps: require("./maps"),
  //api
  endpointTestRoute,
  reqTestMessage,
  //db/models
  dbLookup,
  dbAddRecord,
  // dbUpdateRecord,
  // discord commands
  discordMessageRendering: require("./discordMessageRendering"),
};
