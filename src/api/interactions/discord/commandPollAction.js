const pollAction = (req, res) => {
  const custom_id = req.body.data.custom_id;
  const custom_id_regex = custom_id.match("(poll/)(\\d+)(/)(\\w+)");
  const action = custom_id_regex[4];
  // const pollCommandId = custom_id_regex[2];

  const voteOnPoll = () => {
    res.send({
      type: 7,
      data: {
        content: "some action",
        embeds: [],
      },
    });
  };

  const closePoll = () => {
    res.send({
      type: 7,
      data: {
        content: "poll closed",
        embeds: [],
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
