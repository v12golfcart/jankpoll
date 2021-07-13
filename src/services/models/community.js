const { pool } = require("../database");

const model = {
  community_id: "bigint",
  created_ts: "timestamp",
  discord_admin_id: "bigint",
};

// create table
const createCommunityTable = async () => {
  const client = await pool.connect();
  const queryText = `
  CREATE TABLE IF NOT EXISTS communities ( 
    ${Object.keys(model)
      .map((i) => `${i} ${model[i]}`)
      .join(", ")}
    )
    `;
  try {
    await client.query(queryText);
  } catch (e) {
    console.error("Error with createCommunityTable: ", e.message);
  } finally {
    client.release();
  }
};

// fetch community by id

// add community

// update community

module.exports = {
  createCommunityTable,
};
