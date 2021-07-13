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
  message_id: "bigint",
  poll_type: "int",
  prompt_value: "varchar",
  prompt_img_url: "varchar",
  is_multi_choice: "boolean",
  is_anonymous: "boolean",
  responses_hidden: "boolean",
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
    message_id,
    poll_type,
    prompt_value,
    prompt_img_url,
    is_multi_choice,
    is_anonymous,
    responses_hidden,
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
        message_id,
        poll_type,
        prompt_value,
        prompt_img_url,
        is_multi_choice,
        is_anonymous,
        responses_hidden,
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

// update community

module.exports = {
  model,
  createPollTable,
  lookupPollById,
  createPoll,
};
