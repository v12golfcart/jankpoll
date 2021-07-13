const { pool } = require("../database");

const model = {
  leaderboard_id: "serial primary key",
  created_ts: "timestamp",
  community_id: "bigint",
  discord_creator_id: "bigint",
  discord_username: "varchar",
  discord_discriminator: "varchar",
  discord_avatar: "varchar",
  leaderboard_name: "varchar",
};

// create table
const createLeaderboardTable = async () => {
  const client = await pool.connect();
  const queryText = `
  CREATE TABLE IF NOT EXISTS leaderboards ( 
    ${Object.keys(model)
      .map((i) => `${i} ${model[i]}`)
      .join(", ")}
    )
    `;
  try {
    await client.query(queryText);
  } catch (e) {
    console.error("Error with createLeaderboardTable: ", e.message);
  } finally {
    client.release();
  }
};

// fetch community by id

// add community

// update community

module.exports = {
  model,
  createLeaderboardTable,
};
