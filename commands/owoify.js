exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const {
    Attachment
  } = require("discord.js");

  var say = args.join(" ")

  if (say == "" || say == undefined) {
    return message.reply("you must supply some text")
  }

  let msg
  msg = await message.channel.send(`<a:loading:417323455147540490> Waiting for the Owoification...`);


  var out = await client.idiotAPI.owoify(say)
  message.channel.send(out)


  await msg.delete();


};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['owo'],
  permLevel: "User"
};

exports.help = {
  name: "owoify",
  category: "Memes",
  description: "Get a search image.",
  usage: "search @Person"
};
