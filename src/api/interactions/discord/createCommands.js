const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
require("../../../utils").endpointTestRoute(router);
const { DISCORD_BOT_TOKEN } = require("../../../config/environment");

const uri =
  "https://discord.com/api/v8/applications/862780389612191755/guilds/826907230465032192/commands";

const helpRequest = {
  name: "help",
  description: "Learn how to use the jank poll bot!",
};
router.get("/help/", async (req, res) => {
  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
      body: JSON.stringify(helpRequest),
    });
    const data = await response.json();
    res.send(data);
  } catch (e) {
    console.error(e.message);
    res.send(`something went wrong: ${e.message}`);
  }
});

const create = {
  name: "create",
  description: "Create a type of poll for your members.",
  options: [
    {
      name: "poll",
      description: "A simple poll -- members can choose 1 or multiple options.",
      type: 1,
      options: [
        {
          name: "prompt",
          description: "The question",
          type: 3,
          required: "True",
        },
        {
          name: "multi-choice",
          description: "Can users select more than 1 option?",
          type: 5,
          required: "False",
        },
        {
          name: "results-hidden",
          description: "Only show results when poll is ended?",
          type: 5,
          required: "False",
        },
        {
          name: "is-anonymous",
          description: "Reveal who voted for what?",
          type: 5,
          required: "False",
        },
        {
          name: "prompt-image",
          description: "Include a url to an image as part of the prompt?",
          type: 3,
          required: "False",
        },
        {
          name: "choice1",
          description: "First choice",
          type: 3,
          required: "False",
        },
        {
          name: "choice2",
          description: "Second choice",
          type: 3,
          required: "False",
        },
        {
          name: "choice3",
          description: "Third choice",
          type: 3,
          required: "False",
        },
        {
          name: "choice4",
          description: "Fourth choice",
          type: 3,
          required: "False",
        },
        {
          name: "choice5",
          description: "Fifth choice",
          type: 3,
          required: "False",
        },
      ],
    },
  ],
};
router.get("/create/", async (req, res) => {
  try {
    const response = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
      body: JSON.stringify(create),
    });
    const data = await response.json();
    res.send(data);
  } catch (e) {
    console.error(e.message);
    res.send(`something went wrong: ${e.message}`);
  }
});

module.exports = router;
