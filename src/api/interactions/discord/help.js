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
            title: "test",
            description: "test description",
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
