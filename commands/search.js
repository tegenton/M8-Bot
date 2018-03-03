exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const {
    Attachment
  } = require("discord.js");

  const settings = client.settings.get(message.guild.id);
  if (!settings.imageCommands) {
    settings.imageCommands = "on"
    client.settings.set(message.guild.id, settings)
  } else {
    if (settings.imageCommands == "off" || settings.imageCommands == "false") {
      return;
    }
  }

  const person = message.content.replace(client.config.prefix, "").split(" ").slice(1)

  var userInfo = client.userInfo.get(message.author.id)
  var points = parseInt(client.userInfo.get(message.author.id).points)

  if (points <= 0){
    return message.reply(`you do not have enough ${client.config.pointName} to buy a custom image.`)
  }

  if (message.mentions.members.size == 1) {
    var target = message.mentions.members.first().user
    var say = args.join(" ").split(person[0] + " ")[1]
  } else {
    var target = message.author;
    var say = args.join(" ")
  }

  if (say == "" || say == undefined){
    return message.reply("you must supply some text")
  }

  let msg
  msg = await message.channel.send(`<a:loading:417323455147540490> Aliens are searching the cosmos for life...`);

  await message.channel.send(new Attachment(
    await client.idiotAPI.theSearch(target.displayAvatarURL, say),
    "search.png"));

    var userInfo = client.userInfo.get(message.author.id)
    var points = parseInt(client.userInfo.get(message.author.id).points)
    userInfo.points = points - 1;
    client.userInfo.set(message.author.id, userInfo)

  await msg.delete();


};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "search",
  category: "Memes",
  description: "Get a search image.",
  usage: "search @Person"
};