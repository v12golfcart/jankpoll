const { pool } = require("../database");
const { dbLookup, dbAddRecord, isoToPsql } = require("../../utils");

const model = {
  choice_id: "serial primary key",
  poll_id: "bigint",
  created_ts: "timestamp",
  community_id: "bigint",
  discord_creator_id: "bigint",
  discord_username: "varchar",
  discord_discriminator: "varchar",
  discord_avatar: "varchar",
  poll_type: "int",
  poll_message_id: "bigint",
  poll_prompt_value: "varchar",
  poll_prompt_img_url: "varchar",
  poll_is_multi_choice: "boolean",
  poll_is_anonymous: "boolean",
  poll_responses_hidden: "boolean",
  poll_quiz_leaderboard_id: "bigint",
  choice_n: "int",
  choice_value: "varchar",
  choice_is_correct: "boolean",
};

// create table
const createChoiceTable = async () => {
  const client = await pool.connect();
  const queryText = `
  CREATE TABLE IF NOT EXISTS choices ( 
    ${Object.keys(model)
      .map((i) => `${i} ${model[i]}`)
      .join(", ")}
    )
    `;
  try {
    await client.query(queryText);
  } catch (e) {
    console.error("Error with createChoiceTable: ", e.message);
  } finally {
    client.release();
  }
};

// lookup choice by id
const lookupChoicesByPollId = async (poll_id) => {
  return await dbLookup(pool, "choices", model, "poll_id", poll_id, false);
};

// create choice
const createChoice = async ({
  poll_id,
  community_id,
  discord_creator_id,
  discord_username,
  discord_discriminator,
  discord_avatar,
  poll_type,
  poll_message_id,
  poll_prompt_value,
  poll_prompt_img_url,
  poll_is_multi_choice,
  poll_is_anonymous,
  poll_responses_hidden,
  poll_quiz_leaderboard_id,
  choice_n,
  choice_value,
  choice_is_correct,
}) => {
  const created_ts = isoToPsql(new Date().toISOString());
  return await dbAddRecord(
    pool,
    "choices",
    model,
    {
      poll_id,
      created_ts,
      community_id,
      discord_creator_id,
      discord_username,
      discord_discriminator,
      discord_avatar,
      poll_type,
      poll_message_id,
      poll_prompt_value,
      poll_prompt_img_url,
      poll_is_multi_choice,
      poll_is_anonymous,
      poll_responses_hidden,
      poll_quiz_leaderboard_id,
      choice_n,
      choice_value,
      choice_is_correct,
    },
    [
      "poll_id",
      "community_id",
      "poll_type",
      "choice_n",
      "choice_value",
      "choice_is_correct",
    ]
  );
};

// update community

module.exports = {
  model,
  createChoiceTable,
  lookupChoicesByPollId,
  createChoice,
};
