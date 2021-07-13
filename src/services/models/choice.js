const { pool } = require("../database");

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

// fetch community by id

// add community

// update community

module.exports = {
  model,
  createChoiceTable,
};
