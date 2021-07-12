const sendHelp = (req, res) => {
  try {
    res.status(200).send({
      type: 4,
      data: {
        tts: "False",
        content: `Here's how to use JankPoll:`,
        embeds: [
          {
            type: "rich",
            title: "Types of polls you can create:",
            description:
              "1️⃣ `/poll`: A simple poll -- members can choose 1 or multiple options.\n\n2️⃣ `/quiz`: Create a poll with a correct answer. Think trivia or guessing games.\n\n3️⃣ `/upvote`: collect submissions from members and allow them to upvote. Think questions for an AMA.",
          },
          {
            type: "rich",
            url: "https://discord.gg/rMAMDJZ7Fk",
            title: "Join the community!",
            description:
              "https://discord.gg/rMAMDJZ7Fk \nJoin this community for more help and see how other people use this.",
          },
        ],
      },
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

module.exports = sendHelp;
// https://discord.gg/rMAMDJZ7Fk
