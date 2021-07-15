const { pollModel, responseModel } = require("../../../services/models");
const { discordMessageRendering } = require("../../../utils");

const pollAction = (req, res) => {
  const { id, member } = req.body;
  const user = member.user;
  const custom_id = req.body.data.custom_id;
  const custom_id_regex = custom_id.match("poll/(\\d+)/(\\w+)");
  const poll_id = custom_id_regex[1];
  const action = custom_id_regex[2];
  console.log(custom_id_regex);
  // const pollCommandId = custom_id_regex[2];

  const voteOnPoll = async () => {
    const customPollRegex = custom_id.match("poll/(\\d+)/(\\w+)/(\\d+)/");
    const choice_n = parseInt(customPollRegex[3]);

    try {
      // handle poll voting
      await responseModel.votePoll(id, poll_id, choice_n, user);

      // rebuild full poll
      const poll = await pollModel.getFullPollStateByPollId(poll_id);
      console.log("poll", poll);

      // TODO reply with an ephemeral message about captured responses

      // update the poll
      res.send({
        type: 7,
        data: discordMessageRendering.renderPoll(poll),
      });
    } catch (e) {
      console.error("Error handling user response: ", e.message);
      res.send({
        type: 4,
        data: {
          content: "Something went wrong -- try again.",
          flags: 64,
        },
      });
    }
  };

  const revealPollResults = async () => {
    try {
      // update poll to reveal answers
      await pollModel.revealPollResults(poll_id);

      // rebuild full poll
      const poll = await pollModel.getFullPollStateByPollId(poll_id);
      console.log("poll", poll);

      // update the poll
      res.send({
        type: 7,
        data: discordMessageRendering.renderPoll(poll),
      });
    } catch (e) {
      console.error("Error handling user response: ", e.message);
      res.send({
        type: 4,
        data: {
          content: "Something went wrong -- try again.",
          flags: 64,
        },
      });
    }
  };

  switch (action) {
    case "vote":
      voteOnPoll();
      break;
    case "reveal":
      revealPollResults();
      break;
    default:
      res.send("Unknown command");
  }
};

module.exports = pollAction;
