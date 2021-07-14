const {
  pollModel,
  responseModel,
  choiceModel,
} = require("../../../services/models");

const pollAction = (req, res) => {
  const { id, member } = req.body;
  const user = member.user;
  const custom_id = req.body.data.custom_id;
  const custom_id_regex = custom_id.match("poll/(\\d+)/(\\w+)/(\\d+)/");
  const poll_id = custom_id_regex[1];
  const action = custom_id_regex[2];
  const choice_n = parseInt(custom_id_regex[3]);
  console.log(custom_id_regex);
  // const pollCommandId = custom_id_regex[2];

  const voteOnPoll = async () => {
    try {
      // get the choice
      const choices = await choiceModel.fetchChoicesByPollId(poll_id);
      const choice = choices.filter((i) => i.choice_n === choice_n)[0];

      // save the response to db
      const responseData = {
        response_id: id,
        choice_id: choice.choice_id,
        choice_n,
        choice_value: choice.choice_value,
        community_id: choice.community_id,
        poll_id,
        poll_type: choice.poll_type,
        discord_responder_id: user.id,
        discord_username: user.username,
        discord_discriminator: user.discriminator,
        discord_avatar: user.avatar,
        response_value: choice.choice_value,
      };
      await responseModel.createResponse([responseData]);

      // rebuild full poll
      const poll = await pollModel.getFullPollStateByPollId(poll_id);
      console.log("poll", poll);

      // reply with an ephemeral message about captured responses
      // i dunno how to do this

      // update the poll
      res.send({
        type: 7,
        data: {
          content: "some action",
        },
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

  const closePoll = () => {
    res.send({
      type: 7,
      data: {
        content: "poll closed",
      },
    });
  };

  switch (action) {
    case "vote":
      voteOnPoll();
      break;
    case "close":
      closePoll();
      break;
    default:
      res.send("Unknown command");
  }
};

module.exports = pollAction;
