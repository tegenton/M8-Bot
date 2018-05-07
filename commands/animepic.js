exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  const settings = await client.getSettings(message.guild.id);
  if (!settings.imageCommands) {
    settings.imageCommands = "on"
    client.settings.set(message.guild.id, settings)
  } else {
    if (settings.imageCommands == "off" || settings.imageCommands == "false") {
      return;
    }
  }

  const userInfo = await client.getUserInfo(message.author.id);
  var points = parseInt(userInfo.points)

  if (points <= 0) {
    return message.reply(`you do not have enough ${client.config.pointName} to buy an image.`)
  }

  let msg
  msg = await message.channel.send(`<a:loading:417323455147540490> ${message.author.username} searching through their anime folder...`);

  var snek = require('snekfetch')
  var Discord = require('discord.js')

  var {
    body
  } = await snek.get("https://computerfreaker.cf/api/anime/read.php")

  // message.channel.send(body.url)

  const animeEmbed = new Discord.RichEmbed()
    .setImage(body.url)
    .setFooter("Sent via M8 Bot", client.config.botLogo)
    .setTimestamp()
    .setColor(0x9900FF)


  await message.channel.send({
    embed: animeEmbed
  })

   userInfo.points = points - 1;
   client.userInfo.get(message.author.id).update({
     "userInfo": userInfo
   }).run();
   await msg.delete();

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "animepic",
  category: "IMG",
  description: "",
  usage: ""
};