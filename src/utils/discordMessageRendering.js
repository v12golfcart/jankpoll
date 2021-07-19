const { emojiChoices, emojiBarColors } = require("./maps");

const renderPromptEmbed = (pollData, isActive = true) => {
  const { pollCreator, prompt_value, prompt_img_url, choices } = pollData;
  const { avatar, discriminator, username, id } = pollCreator;
  return {
    title: prompt_value,
    description: choices
      .map((i) => `${emojiChoices[i.n]} ${i.value}`)
      .join("\n"),
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

const renderResponseEmbed = (
  pollData,
  respondentsSet,
  isActive = false,
  respondentsAreShown = false
) => {
  const totalResponses = pollData.choices.reduce((acc, i) => {
    return acc + i.respondents.length;
  }, 0);

  const renderBar = (n, size, numResponses) => {
    return `${emojiChoices[n]}:${emojiBarColors[n].repeat(
      size
    )} (${numResponses})`;
  };

  const renderRespondents = (respondents) => {
    if (respondents.length === 0) return "\n";
    return (
      "\n" +
      respondents.map((i) => `${i.username}#${i.discriminator}`).join(", ") +
      "\n"
    );
  };

  const renderGraph = (pollData, totalResponses) => {
    const choices = pollData.choices;

    return choices
      .map((i) => {
        const n = i.n;
        const numResponses = i.respondents.length;
        const size = (numResponses / totalResponses).toFixed(1) * 10;
        const bar = renderBar(n, size, numResponses);
        const respondents = respondentsAreShown
          ? renderRespondents(i.respondents)
          : "";
        return bar + respondents;
      })
      .join("\n");
  };

  if (isActive) {
    return {
      title: `${totalResponses} Responses`,
      description: renderGraph(pollData, totalResponses),
      color: isActive && "41667",
    };
  } else {
    return {
      description: `_Click Reveal to see responses._\n${
        respondentsSet.size
      } responses${
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
        emoji: { name: emojiChoices[index + 1] },
        custom_id: `poll/${poll_id}/vote/${i.n}/${pollCreator.id}`,
      };
    }),
  };
};

const renderPollActions = (
  pollData,
  allRespondentsSet,
  showRespondents = false
) => {
  const { poll_id, responses_hidden } = pollData;
  const respondentsButton = () => {
    return showRespondents
      ? {
          type: 1,
          components: [
            {
              type: 2,
              label: "Hide respondents",
              style: 2,
              custom_id: `poll/${poll_id}/respondents_hide`,
            },
          ],
        }
      : {
          type: 1,
          components: [
            {
              type: 2,
              label: "Show respondents",
              style: 2,
              custom_id: `poll/${poll_id}/respondents_show`,
            },
          ],
        };
  };

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
    : [respondentsButton()];
};

const renderPoll = (pollData, initialMessage, stateConfig) => {
  const {
    is_multi_choice,
    responses_hidden,
    // is_anonymous,
  } = pollData;

  // are respondents being shown?
  const showingRespondents = () => {
    if (!responses_hidden && initialMessage && initialMessage.components[1]) {
      const buttonState = initialMessage.components[1].components[0].custom_id;
      const currentRespondentsState = buttonState.match("respondents_hide")
        ? true
        : false;

      // if toggle flip value, else keep value
      if (stateConfig && stateConfig.toggleShowRespondents)
        return !currentRespondentsState;
      else return currentRespondentsState;
    } else {
      return false;
    }
  };
  const respondentsAreShown = showingRespondents();

  // make a responses set
  const allRespondentsSet = new Set();
  pollData.choices.map((i) => {
    // for each choice, loop through respondents and add to set
    return i.respondents.map((i) => allRespondentsSet.add(`${i.username}`));
  });

  return {
    content: is_multi_choice
      ? "Select all the answers that apply:"
      : "Select one answer:",
    embeds: [
      // question
      renderPromptEmbed(pollData, responses_hidden),
      // responses
      renderResponseEmbed(
        pollData,
        allRespondentsSet,
        !responses_hidden,
        respondentsAreShown
      ),
    ],
    components: [
      // choices
      renderChoices(pollData),
      // show an end poll button if responses are set to hidden
      ...renderPollActions(pollData, allRespondentsSet, respondentsAreShown),
    ],
  };
};

const renderLeaderboardLists = (leaderboardsInfo) => {
  const { community_id } = leaderboardsInfo;
  const leaderboards = [
    {
      leaderboard_id: 123,
      leaderboard_name: "testing 1",
      standings: [
        {
          id: 123,
          username: "xtopher",
          discriminator: "1234",
          avatar: "",
          score: 123,
          rank: 1,
        },
        {
          id: 123,
          username: "whiskeybravo",
          discriminator: "1234",
          avatar: "",
          score: 10,
          rank: 2,
        },
      ],
    },
  ];

  return {
    content: "These are your leaderboards:",
  };
};

const renderLeaderboard = (leaderboard, customContent) => {
  const renderStandings = (standings) => {
    if (standings.length === 0)
      return "Nobody has any points yet. Create some quizzes for your members!";

    return standings
      .map(
        (i, index) =>
          `${index + 1}. ${i.username}#${i.discriminator}: ${i.score} points`
      )
      .join("\n\n");
  };

  return {
    content: customContent || "These are your leaderboards:",
    embeds: [
      {
        title: leaderboard.leaderboard_name,
        description: renderStandings(leaderboard.standings),
        color: "41667",
      },
    ],
  };
};

module.exports = {
  renderPoll,
  renderLeaderboardLists,
  renderLeaderboard,
};
