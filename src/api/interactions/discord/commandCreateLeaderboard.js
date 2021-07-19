const { discordMessageRendering } = require("../../../utils");

const createLeaderboard = async (req, res) => {
  const leaderboardData = req.body.data.options[0].options;
  const leaderboardCreator = req.body.member.user;

  const getValue = (obj, name, nullValue) => {
    const param = obj.filter((i) => i.name === name)[0];
    return param ? param.value : nullValue;
  };

  try {
    const leaderboard = {
      community_id: req.body.guild_id,
      leaderboardCreator,
      leaderboard_name: getValue(leaderboardData, "name"),
    };
    console.log("leaderboard params", leaderboard);

    // save new poll and choices to db

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

module.exports = createLeaderboard;
