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

const renderResponseEmbed = (pollData, respondentsSet, isActive = false) => {
  if (isActive) {
    return {
      description: `_Results!!!_`,
      color: isActive && "41667",
    };
  } else {
    return {
      description: `_Poll must be closed before responses are shown._\n
      ${respondentsSet.size} responses${
        respondentsSet.size > 0 ? `: ${[...respondentsSet].join(", ")}` : ``
      }
      `,
    };
  }
};

const renderChoices = (pollData) => {
  const { poll_id, pollCreator, choices } = pollData;
  return {
    type: 1,
    components: choices.map((i, index) => {
      return {
        type: 2,
        style: 2,
        emoji: { name: emojiMap[index + 1] },
        custom_id: `poll/${poll_id}/vote/${i.n}/${pollCreator.id}`,
      };
    }),
  };
};

const renderPollActions = (pollData, allRespondentsSet) => {
  const { poll_id, responses_hidden } = pollData;
  return responses_hidden
    ? [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: "Reveal",
              style: allRespondentsSet.size > 0 ? 3 : 4,
              custom_id: `poll/${poll_id}/reveal`,
            },
          ],
        },
      ]
    : [];
};

const renderPoll = (pollData) => {
  const {
    is_multi_choice,
    responses_hidden,
    // is_anonymous,
  } = pollData;

  // make a responses set
  const allRespondentsSet = new Set();
  pollData.choices.map((i) => {
    // for each choice, loop through respondants and add to set
    i.respondents.map((i) => allRespondentsSet.add(`${i.username}`));
  });

  return {
    content: is_multi_choice
      ? "Select all the answers that apply:"
      : "Select one answer:",
    embeds: [
      // question
      renderPromptEmbed(pollData, responses_hidden),
      // responses
      renderResponseEmbed(pollData, allRespondentsSet, !responses_hidden),
    ],
    components: [
      // choices
      renderChoices(pollData),
      // show an end poll button if responses are set to hidden
      ...renderPollActions(pollData, allRespondentsSet),
    ],
  };
};

module.exports = {
  renderPoll,
};
