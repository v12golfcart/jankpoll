const { emojiMap } = require("./maps");

const renderPromptEmbed = (pollData, isActive = true) => {
  const { pollCreator, prompt_value, prompt_img_url, choices } = pollData;
  const { avatar, discriminator, username, id } = pollCreator;
  return {
    title: prompt_value,
    description: choices.map((i) => `${emojiMap[i.n]} ${i.value}`).join("\n"),
    color: isActive && "41667",
    image: {
      url: prompt_img_url,
      proxy_url: prompt_img_url,
    },
    footer: {
      text: `By ${username}#${discriminator}`,
      icon_url: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`,
      proxy_icon_url: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`,
    },
  };
};

const renderResponseEmbed = (pollData, isActive = false) => {
  const allRespondents = new Set();
  pollData.choices.map((i) => {
    // for each choice, loop through respondants and add to set
    i.respondents.map((i) => allRespondents.add(`${i.username}`));
  });

  if (isActive) {
    return {
      description: `_Results!!!_`,
    };
  } else {
    return {
      description: `_Poll must be closed before responses are shown._\n
      ${allRespondents.size} responses${
        allRespondents.size > 0 ? `: ${[...allRespondents].join(", ")}` : ``
      }
      `,
    };
  }
};

const renderPoll = (pollData) => {
  const {
    pollCreator,
    poll_id,
    is_multi_choice,
    responses_hidden,
    // is_anonymous,
    choices,
  } = pollData;

  return {
    content: is_multi_choice
      ? "Select all the answers that apply:"
      : "Select one answer:",
    embeds: [
      // question
      renderPromptEmbed(pollData),
      // responses
      renderResponseEmbed(pollData),
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
            custom_id: `poll/${poll_id}/vote/${i.n}/${pollCreator.id}`,
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
                  label: "Reveal",
                  style: 3,
                  custom_id: `poll/${poll_id}/reveal`,
                },
              ],
            },
          ]
        : []),
    ],
  };
};

module.exports = {
  renderPoll,
};
