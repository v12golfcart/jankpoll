const { pool } = require("../database");

const model = {
  response_id: "serial",
  created_ts: "timestamp",
  choice_id: "int",
  choice_n: "int",
  choice_value: "varchar",
  choice_is_correct: "boolean",
  community_id: "bigint",
  poll_id: "bigint",
  poll_type: "int",
  poll_quiz_leaderboard_id: "bigint",
  discord_responder_id: "bigint",
  discord_username: "varchar",
  discord_discriminator: "varchar",
  discord_avatar: "varchar",
  response_value: "varchar",
  response_quiz_bet: "int",
  response_quiz_outcome: "int",
};

// create table
const createResponseTable = async () => {
  const client = await pool.connect();
  const queryText = `
  CREATE TABLE IF NOT EXISTS responses ( 
    ${Object.keys(model)
      .map((i) => `${i} ${model[i]}`)
      .join(", ")}
    )
    `;
  try {
    await client.query(queryText);
  } catch (e) {
    console.error("Error with createResponseTable: ", e.message);
  } finally {
    client.release();
  }
};

// fetch community by id

// add community

// update community

module.exports = {
  createResponseTable,
};
