const { emojiMap } = require("./maps");

const renderPoll = ({
  pollCreator,
  poll_id,
  prompt_value,
  prompt_img_url,
  is_multi_choice,
  responses_hidden,
  // is_anonymous,
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

module.exports = {
  renderPoll,
};
