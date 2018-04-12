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
  } else {
    var target = message.author;
  }

  let msg
  msg = await message.channel.send("<a:loading:417323455147540490> pressing `F` to respect...");

  await message.channel.send(new Attachment(
    await client.idiotAPI.respect(target.displayAvatarURL),
    "respect.png"));

  var userInfo = client.userInfo.get(message.author.id)
  var points = parseInt(client.userInfo.get(message.author.id).points)
  userInfo.points = points - 1;
  client.userInfo.set(message.author.id, userInfo)

  await msg.delete();


};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["pressf", "f"],
  permLevel: "User"
};

exports.help = {
  name: "respect",
  category: "Memes",
  description: "Get a respect image.",
  usage: "respect @Person"
};