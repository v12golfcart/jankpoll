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
    let poll;

    // if found a poll, populate it
    if (choicesData.length > 0) {
      const referencePollData = choicesData[0];

      // get all responses
      const responsesQuery = `SELECT * FROM responses WHERE poll_id = ${poll_id}`;
      const responsesRes = await client.query(responsesQuery);
      const responsesData = responsesRes.rows;

      const transformResponses = (responses, choice_n) => {
        if (responses && responses.length > 0) {
          return responses
            .filter((i) => i.choice_n === choice_n)
            .map((i) => {
              return {
                id: i.discord_responder_id,
                username: i.discord_username,
                discriminator: i.discord_discriminator,
                avatar: i.discord_avatar,
              };
            });
        } else {
          return [];
        }
      };

      poll = {
        pollCreator: {
          id: referencePollData.discord_creator_id,
          username: referencePollData.discord_username,
          discriminator: referencePollData.discord_discriminator,
          avatar: referencePollData.discord_avatar,
        },
        poll_id: referencePollData.poll_id,
        community_id: referencePollData.community_id,
        pollChannelId: null,
        prompt_value: referencePollData.poll_prompt_value,
        prompt_img_url: referencePollData.poll_prompt_img_url,
        is_multi_choice: referencePollData.poll_is_multi_choice,
        responses_hidden: referencePollData.poll_responses_hidden,
        is_anonymous: referencePollData.poll_is_anonymous,
        choices: choicesData.map((i) => {
          return {
            n: i.choice_n,
            value: i.choice_value,
            respondents: transformResponses(responsesData, i.choice_n),
          };
        }),
      };
    }
    return poll;
  } catch (e) {
    console.error("Error with fetching full poll state: ", e.message);
  } finally {
    client.release();
  }
};

module.exports = {
  model,
  createPollTable,
  lookupPollById,
  createPoll,
  getFullPollStateByPollId,
};
