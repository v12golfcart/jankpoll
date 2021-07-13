const { pool } = require("../database");

const model = {
  poll_id: "bigint",
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

const pollTypes = {
  1: "poll",
  2: "quiz",
  3: "upvote",
};

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

// fetch community by id

// add community

// update community

module.exports = {
  createPollTable,
};
