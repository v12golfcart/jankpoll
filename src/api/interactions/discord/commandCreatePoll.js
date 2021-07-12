const createPoll = (req, res) => {
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
      pollCommandId: req.body.id,
      pollGuildId: req.body.guild_id,
      pollChannelId: req.body.channel_id,
      prompt: getValue(pollData, "prompt"),
      promptImgUrl: getValue(pollData, "prompt-image"),
      isMultiChoice: getValue(pollData, "multi-choice", false),
      resultsAreHidden: getValue(pollData, "results-hidden", true),
      isAnonymous: getValue(pollData, "is-anonymous", false),
      choices: getChoices(pollData),
    };
    console.log("poll params", poll);

    const buildPoll = ({
      pollCreator,
      pollCommandId,
      prompt,
      promptImgUrl,
      isMultiChoice,
      resultsAreHidden,
      isAnonymous,
      choices,
    }) => {
      const { avatar, discriminator, username, id } = pollCreator;

      return {
        content: isMultiChoice
          ? "Select all the answers that apply:"
          : "Select one answer:",
        embeds: [
          // question
          {
            title: prompt,
            description: choices
              .map((i) => `${emojiMap[i.n]} ${i.value}`)
              .join("\n"),
            color: "41667",
            image: {
              url: promptImgUrl,
              proxy_url: promptImgUrl,
            },
            footer: {
              text: `By ${username}#${discriminator}`,
              icon_url: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`,
              proxy_icon_url: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`,
            },
          },
          // responses
          {
            // title: "Results",
            description: "_Poll must be closed before responses are shown._",
            // fields: [
            //   {
            //     name: "Answered by:",
            //     value: "<@301969677100515328>, <@437618149505105920>",
            //     inline: "false",
            //   },
            // ],
          },
        ],
        components: [
          {
            type: 1,
            components: choices.map((i, index) => {
              return {
                type: 2,
                style: 2,
                emoji: { name: emojiMap[index + 1] },
                custom_id: `poll/${pollCommandId}/vote/${i.n}/${username}#${discriminator}`,
              };
            }),
          },
          {
            type: 1,
            components: [
              {
                type: 2,
                label: "Close poll",
                style: 4,
                custom_id: "close",
              },
            ],
          },
        ],
      };
    };

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
