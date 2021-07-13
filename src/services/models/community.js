const { pool } = require("../database");
const { dbLookup, dbAddRecord, isoToPsql } = require("../../utils");

const model = {
  community_id: "bigint PRIMARY KEY",
  community_name: "varchar",
  community_icon: "varchar",
  created_ts: "timestamp",
  discord_admin_id: "bigint",
  discord_username: "varchar",
  discord_discriminator: "varchar",
  discord_avatar: "varchar",
  discord_email: "varchar",
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

// lookup community by id
const lookupCommunityById = async (id) => {
  return await dbLookup(pool, "communities", model, "community_id", id);
};

// create community
const createCommunity = async ([
  {
    community_id,
    community_name,
    community_icon,
    discord_admin_id,
    discord_username,
    discord_discriminator,
    discord_avatar,
    discord_email,
  },
]) => {
  const created_ts = isoToPsql(new Date().toISOString());
  return await dbAddRecord(
    pool,
    "communities",
    model,
    [
      {
        community_id,
        community_name,
        community_icon,
        created_ts,
        discord_admin_id,
        discord_username,
        discord_discriminator,
        discord_avatar,
        discord_email,
      },
    ],
    [
      "community_id",
      "community_name",
      "created_ts",
      "discord_admin_id",
      "discord_username",
      "discord_discriminator",
      "discord_email",
    ]
  );
};

// update community

module.exports = {
  model,
  createCommunityTable,
  lookupCommunityById,
  createCommunity,
};
