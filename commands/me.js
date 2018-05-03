exports.run = async (client, message) => {
  const Discord = require("discord.js");
  const settings = require("../config.js");
  message.delete();

  const userInfo = await client.getUserInfo(message.author.id);
  
  const meEmbed = new Discord.RichEmbed()
    .setTitle(message.author.username)
    .setColor(0x9900FF)
    .setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
    .setThumbnail(message.author.displayAvatarURL)
    .setTimestamp()
    .addField("ID", message.author.id, true)
    .addField("Bot", message.author.bot, true)
    .addField("Registered", message.author.createdAt)
    .addField(settings.pointName, userInfo.points, true)
    .addField("Blames", userInfo.blames, true)
  message.channel.send({
    embed: meEmbed
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'me',
  description: 'Get info about your discord account.',
  usage: 'me'
};
