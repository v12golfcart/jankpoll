const { pool } = require("../database");
const { dbLookup, dbAddRecord, isoToPsql } = require("../../utils");

const model = {
  poll_id: "bigint primary key",
  created_ts: "timestamp",
  community_id: "bigint",
  discord_creator_id: "bigint",
  discord_username: "varchar",
  discord_discriminator: "varchar",
  discord_avatar: "varchar",
  poll_message_id: "bigint",
  poll_type: "int",
  poll_prompt_value: "varchar",
  poll_prompt_img_url: "varchar",
  poll_is_multi_choice: "boolean",
  poll_is_anonymous: "boolean",
  poll_responses_hidden: "boolean",
  quiz_leaderboard_id: "bigint",
};

// const pollTypes = {
//   1: "poll",
//   2: "quiz",
//   3: "upvote",
// };

// create table
const createPollTable = async () => {
  const client = await pool.connect();
  const queryText = `
  CREATE TABLE IF NOT EXISTS polls ( 
    ${Object.keys(model)
      .map((i) => `${i} ${model[i]}`)
      .join(", ")}
    )
    `;
  try {
    await client.query(queryText);
  } catch (e) {
    console.error("Error with createPollTable: ", e.message);
  } finally {
    client.release();
  }
};

// lookup poll by id
const lookupPollById = async (id) => {
  return await dbLookup(pool, "polls", model, "poll_id", id);
};

// create poll
const createPoll = async ([
  {
    poll_id,
    community_id,
    discord_creator_id,
    discord_username,
    discord_discriminator,
    discord_avatar,
    poll_message_id,
    poll_type,
    poll_prompt_value,
    poll_prompt_img_url,
    poll_is_multi_choice,
    poll_is_anonymous,
    poll_responses_hidden,
    quiz_leaderboard_id,
  },
]) => {
  const created_ts = isoToPsql(new Date().toISOString());
  return await dbAddRecord(
    pool,
    "polls",
    model,
    [
      {
        poll_id,
        created_ts,
        community_id,
        discord_creator_id,
        discord_username,
        discord_discriminator,
        discord_avatar,
        poll_message_id,
        poll_type,
        poll_prompt_value,
        poll_prompt_img_url,
        poll_is_multi_choice,
        poll_is_anonymous,
        poll_responses_hidden,
        quiz_leaderboard_id,
      },
    ],
    [
      "poll_id",
      // "community_id",
      // "poll_type",
      // "prompt_value",
      // "discord_creator_id",
      // "discord_username",
      // "discord_discriminator",
    ]
  );
};

// build poll from db
const getFullPollStateByPollId = async (poll_id) => {
  const client = await pool.connect();
  try {
    // get all choices
    const choicesQuery = `SELECT * FROM choices WHERE poll_id = ${poll_id}`;
    const choicesRes = await client.query(choicesQuery);
    const choicesData = choicesRes.rows;
    console.log("found choices", choicesData);

    // get all responses
    const responsesQuery = `SELECT * FROM responses WHERE poll_id = ${poll_id}`;
    const responsesRes = await client.query(responsesQuery);
    const responsesData = responsesRes.rows;
    console.log("found responses", responsesData);
  } catch (e) {
    console.error("Error with fetching full poll state: ", e.message);
  } finally {
    client.release();
  }
};

getFullPollStateByPollId("864652571976138752");

module.exports = {
  model,
  createPollTable,
  lookupPollById,
  createPoll,
};
