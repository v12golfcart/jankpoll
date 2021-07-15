const { pool } = require("../database");
const { dbLookup, dbAddRecord, isoToPsql } = require("../../utils");
const choiceModel = require("./choice");
const format = require("pg-format");

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
  poll_message_id: "bigint",
  poll_prompt_value: "varchar",
  poll_prompt_img_url: "varchar",
  poll_is_multi_choice: "boolean",
  poll_is_anonymous: "boolean",
  poll_responses_hidden: "boolean",
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

// get responses for a given user for a poll
const fetchUserPollResponsesByUserId = async (poll_id, user_id) => {
  const responses = await fetchResponsesByPollId(poll_id);
  let userResponses = [];
  if (responses && responses.length > 0) {
    userResponses = responses.filter((i) => i.discord_responder_id === user_id);
  }
  return userResponses;
};

const checkForExistingResponse = async (poll_id, choice_n, user_id) => {
  const responses = await fetchResponsesByPollId(poll_id);
  return responses.filter(
    (i) => i.discord_responder_id === user_id && i.choice_n === choice_n
  )[0];
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
    poll_prompt_value,
    poll_prompt_img_url,
    poll_is_multi_choice,
    poll_is_anonymous,
    poll_responses_hidden,
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
        poll_prompt_value,
        poll_prompt_img_url,
        poll_is_multi_choice,
        poll_is_anonymous,
        poll_responses_hidden,
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

// deleteResponse
const deleteResponse = async (poll_id, choice_n, user_id) => {
  const client = await pool.connect();
  try {
    const queryText = `DELETE FROM responses WHERE poll_id = ${poll_id} and choice_n = ${choice_n} and discord_responder_id = ${user_id};`;
    await client.query(queryText);
    console.log(
      `Deleted response ${choice_n} from user ${user_id} from ${poll_id}`
    );
  } catch (e) {
    console.error("Error with deleting a response: ", e.message);
  } finally {
    client.release();
  }
};

// replace response
const replaceResponse = async (responseObj) => {
  const created_ts = isoToPsql(new Date().toISOString());
  const client = await pool.connect();
  const { poll_id, discord_responder_id } = responseObj;
  const responseObjWithTs = {
    ...responseObj,
    created_ts,
  };
  try {
    // build query
    const cols = Object.keys(responseObjWithTs).join(", ");
    const values = [Object.values(responseObjWithTs)];
    const query = format(
      `
    DELETE FROM responses 
    WHERE 1=1
      AND poll_id = ${poll_id}
      AND discord_responder_id = ${discord_responder_id}
    ;

    INSERT INTO responses (${cols}) VALUES %L returning *
    `,
      values
    );
    const res = await client.query(query);
    console.log(`Updated a response`, res.rows[0]);
  } catch (e) {
    console.error("Error with upserting a response: ", e.message);
  } finally {
    client.release();
  }
};

// singleChoiceVote
const votePoll = async (response_id, poll_id, choice_n, user) => {
  // get the choice and response data
  const choices = await choiceModel.fetchChoicesByPollId(poll_id);
  const choice = choices.filter((i) => i.choice_n === choice_n)[0];

  // build response data
  const responseObj = {
    response_id,
    choice_id: choice.choice_id,
    choice_n,
    choice_value: choice.choice_value,
    community_id: choice.community_id,
    poll_id,
    poll_type: choice.poll_type,
    poll_prompt_value: choice.poll_prompt_value,
    poll_prompt_img_url: choice.poll_prompt_img_url,
    poll_is_multi_choice: choice.poll_is_multi_choice,
    poll_is_anonymous: choice.poll_is_anonymous,
    poll_responses_hidden: choice.poll_responses_hidden,
    discord_responder_id: user.id,
    discord_username: user.username,
    discord_discriminator: user.discriminator,
    discord_avatar: user.avatar,
    response_value: choice.choice_value,
  };

  // if a response exists, delete it
  const allResponses = await fetchUserPollResponsesByUserId(poll_id, user.id);
  const existingResponse =
    allResponses.length > 0
      ? allResponses.filter((i) => i.choice_n === choice_n)[0]
      : false;
  if (existingResponse) {
    await deleteResponse(poll_id, choice_n, user.id);
  } else {
    if (responseObj.poll_is_multi_choice) {
      await createResponse([responseObj]);
    } else {
      await replaceResponse(responseObj);
    }
  }
};

module.exports = {
  model,
  createResponseTable,
  createResponse,
  fetchResponsesByPollId,
  fetchUserPollResponsesByUserId,
  checkForExistingResponse,
  deleteResponse,
  votePoll,
};
