const { pool } = require("../database");
const { dbLookup, dbAddRecord, isoToPsql } = require("../../utils");

const model = {
  response_id: "bigint primary key",
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

// get all responses by poll id
const fetchResponsesByPollId = async (poll_id) => {
  return await dbLookup(pool, "responses", model, "poll_id", poll_id, false);
};

// create response
const createResponse = async ([
  {
    response_id,
    choice_id,
    choice_n,
    choice_value,
    choice_is_correct,
    community_id,
    poll_id,
    poll_type,
    poll_quiz_leaderboard_id,
    discord_responder_id,
    discord_username,
    discord_discriminator,
    discord_avatar,
    response_value,
    response_quiz_bet,
    response_quiz_outcome,
  },
]) => {
  const created_ts = isoToPsql(new Date().toISOString());
  return await dbAddRecord(
    pool,
    "responses",
    model,
    [
      {
        response_id,
        created_ts,
        choice_id,
        choice_n,
        choice_value,
        choice_is_correct,
        community_id,
        poll_id,
        poll_type,
        poll_quiz_leaderboard_id,
        discord_responder_id,
        discord_username,
        discord_discriminator,
        discord_avatar,
        response_value,
        response_quiz_bet,
        response_quiz_outcome,
      },
    ],
    [
      "response_id",
      "created_ts",
      "choice_id",
      "choice_n",
      "choice_value",
      "community_id",
      "poll_id",
      "poll_type",
      "discord_responder_id",
      "discord_username",
      "discord_discriminator",
      "response_value",
    ]
  );
};

// update community

module.exports = {
  model,
  createResponseTable,
  createResponse,
  fetchResponsesByPollId,
};
