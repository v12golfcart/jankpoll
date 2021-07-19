// WORK IN PROGRESS

const { discordMessageRendering } = require("../../../utils");

const leaderboards = async (req, res) => {
  // const leaderboardData = req.body.data.options[0].options;
  // const leaderboardCreator = req.body.member.user;

  try {
    // get the communities leaderboards
    const leaderboards = [
      {
        leaderboard_id: 123,
        community_id: 123,
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

    //

    res.status(200).send({
      type: 4,
      data: discordMessageRendering.renderLeaderboard(
        null,
        "Your leaderboard was successfull created:"
      ),
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

module.exports = leaderboards;
