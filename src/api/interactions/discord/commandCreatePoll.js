const { pollModel, choiceModel } = require("../../../services/models");
const { discordMessageRendering } = require("../../../utils");

const createPoll = async (req, res) => {
  const pollData = req.body.data.options[0].options;
  const pollCreator = req.body.member.user;

  const getValue = (obj, name, nullValue) => {
    const param = obj.filter((i) => i.name === name)[0];
    return param ? param.value : nullValue;
  };

  const getChoices = (obj) => {
    return obj
      .filter((i) => i.name.match("choice[\\d]"))
      .map((i, index) => {
        return {
          n: index + 1,
          value: i.value,
          respondents: [],
        };
      });
  };

  try {
    const poll = {
      pollCreator,
      poll_id: req.body.id,
      community_id: req.body.guild_id,
      pollChannelId: req.body.channel_id,
      prompt_value: getValue(pollData, "prompt"),
      prompt_img_url: getValue(pollData, "prompt-image"),
      is_multi_choice: getValue(pollData, "multi-choice", false),
      responses_hidden: getValue(pollData, "results-hidden", true),
      is_anonymous: getValue(pollData, "is-anonymous", false),
      choices: getChoices(pollData),
    };
    console.log("poll params", poll);

    // save new poll and choices to db
    const pollBlob = {
      poll_id: poll.poll_id,
      community_id: poll.community_id,
      discord_creator_id: pollCreator.id,
      discord_username: pollCreator.username,
      discord_discriminator: pollCreator.discriminator,
      discord_avatar: pollCreator.avatar,
      poll_type: 1,
      poll_prompt_value: poll.prompt_value,
      poll_prompt_img_url: poll.prompt_img_url,
      poll_is_multi_choice: poll.is_multi_choice,
      poll_is_anonymous: poll.is_anonymous,
      poll_responses_hidden: poll.responses_hidden,
    };
    await pollModel.createPoll([
      {
        ...pollBlob,
      },
    ]);
    await choiceModel.createChoice(
      poll.choices.map((i, index) => {
        return {
          ...pollBlob,
          choice_n: index + 1,
          choice_value: i.value,
        };
      })
    );

    res.status(200).send({
      type: 4,
      data: discordMessageRendering.renderPoll(poll),
    });
  } catch (e) {
    console.error(e.message);
    res.send({
      type: 4,
      data: {
        tts: "False",
        content: `Something went wrong.`,
        embeds: [],
      },
    });
  }
};

module.exports = createPoll;
