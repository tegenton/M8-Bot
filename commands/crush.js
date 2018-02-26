exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const {
    Attachment
  } = require("discord.js");
  const person = message.content.replace(client.config.prefix, "").split(" ").slice(1)

  var userInfo = client.userInfo.get(message.author.id)
  var points = parseInt(client.userInfo.get(message.author.id).points)

  if (points <= 0){
    return message.reply(`you do not have enough ${client.config.pointName} to buy a custom image.`)
  }

  if (message.mentions.members.size == 1) {
    var target = message.mentions.members.first().user
  } else {
    return message.reply("you must mention someone to slap.")
  }

  let msg
  msg = await message.channel.send(`<a:loading:417323455147540490> Its getting all lovey dovey in here...`);


  await message.channel.send(new Attachment(
    await client.idiotAPI.crush(target.displayAvatarURL, message.author.displayAvatarURL),
    "crush.png"));

    var userInfo = client.userInfo.get(message.author.id)
    var points = parseInt(client.userInfo.get(message.author.id).points)
    userInfo.points = points - 1;
    client.userInfo.set(message.author.id, userInfo)

    await msg.delete()

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "crush",
  category: "Memes",
  description: "Get a crush image.",
  usage: "crush @Person"
};