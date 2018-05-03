exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const {
    Attachment
  } = require("discord.js");

  const settings = await client.getSettings(message.guild.id);
  if (!settings.imageCommands) {
    settings.imageCommands = "on"
    client.settings.set(message.guild.id, settings)
  } else {
    if (settings.imageCommands == "off" || settings.imageCommands == "false") {
      return;
    }
  }

  const person = message.content.replace(client.config.prefix, "").split(" ").slice(1)

  const userInfo = await client.getUserInfo(message.author.id);
  var points = parseInt(userInfo.points)

  if (points <= 0) {
    return message.reply(`you do not have enough ${client.config.pointName} to buy a custom image.`)
  }

  if (message.mentions.members.size == 1) {
    var target = message.mentions.members.first().user
  } else {
    var target = message.author;
  }

  let msg
  msg = await message.channel.send(`<a:loading:417323455147540490> Wow, **${target.username}** about to get painted...`);

  await message.channel.send(new Attachment(
    await client.idiotAPI.beautiful(target.displayAvatarURL),
    "beautiful.png"));


  userInfo.points = points - 1;
  client.userInfo.get(message.author.id).update({ "userInfo": userInfo }).run();

  await msg.delete();


};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["painting"],
  permLevel: "User"
};

exports.help = {
  name: "beautiful",
  category: "Memes",
  description: "Get a beautiful image.",
  usage: "beautiful @Person"
};