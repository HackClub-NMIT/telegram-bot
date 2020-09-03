// main bot file

require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log(`Discord bot ready!`);
});

client.on("message", (msg) => {
  console.log(msg.channel);

  if (msg.content === "ping") {
    msg.channel.send("pong");
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
