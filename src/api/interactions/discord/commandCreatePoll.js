const { pollModel } = require("../../../services/models");

const createPoll = async (req, res) => {
  const pollData = req.body.data.options[0].options;
  const pollCreator = req.body.member.user;
  const emojiMap = {
    1: "1️⃣",
    2: "2️⃣",
    3: "3️⃣",
    4: "4️⃣",
    5: "5️⃣",
  };

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

    const buildPoll = ({
      pollCreator,
      poll_id,
      prompt_value,
      prompt_img_url,
      is_multi_choice,
      responses_hidden,
      is_anonymous,
      choices,
    }) => {
      const { avatar, discriminator, username, id } = pollCreator;

      return {
        content: is_multi_choice
          ? "Select all the answers that apply:"
          : "Select one answer:",
        embeds: [
          // question
          {
            title: prompt_value,
            description: choices
              .map((i) => `${emojiMap[i.n]} ${i.value}`)
              .join("\n"),
            color: "41667",
            image: {
              url: prompt_img_url,
              proxy_url: prompt_img_url,
            },
            footer: {
              text: `By ${username}#${discriminator}`,
              icon_url: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`,
              proxy_icon_url: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`,
            },
          },
          // responses
          {
            description: "_Poll must be closed before responses are shown._",
          },
        ],
        // choices
        components: [
          {
            type: 1,
            components: choices.map((i, index) => {
              return {
                type: 2,
                style: 2,
                emoji: { name: emojiMap[index + 1] },
                custom_id: `poll/${poll_id}/vote/${i.n}/${username}#${discriminator}`,
              };
            }),
          },
          // show an end poll button if responses are set to hidden
          ...(responses_hidden
            ? [
                {
                  type: 1,
                  components: [
                    {
                      type: 2,
                      label: "Close poll",
                      style: 4,
                      custom_id: `poll/${poll_id}/close`,
                    },
                  ],
                },
              ]
            : []),
        ],
      };
    };

    // save new poll to db
    await pollModel.createPoll({
      poll_id: poll.poll_id,
      community_id: poll.community_id,
      discord_creator_id: pollCreator.id,
      discord_username: pollCreator.username,
      discord_discriminator: pollCreator.discriminator,
      discord_avatar: pollCreator.avatar,
      poll_type: 1,
      prompt_value: poll.prompt_value,
      prompt_img_url: poll.prompt_img_url,
      is_multi_choice: poll.is_multi_choice,
      is_anonymous: poll.is_anonymous,
      responses_hidden: poll.responses_hidden,
    });

    res.status(200).send({
      type: 4,
      data: buildPoll(poll),
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
