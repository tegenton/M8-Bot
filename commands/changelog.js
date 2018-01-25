exports.run = (client, message) => {
  const Discord = require("discord.js");
  message.delete();
  if (message.guild != null) {
    if (message.guild.iconURL = null) {
      var iconURL = "https://newagesoldier.com/wp-content/uploads/2016/12/masbot.png";
    } else {
      var iconURL = message.guild.iconURL;
    }
    const serverEmbed = new Discord.RichEmbed()
      .setTitle(message.guild.name)
      .setColor(0x9900FF)
      .setFooter("Sent via M8 Bot", "http://i.imgur.com/nXvRJXM.png")
      .setThumbnail(iconURL)
      .setTimestamp()
      .addField("M8 Bot | Change Log", "Check out what has been added/removed/fixed on M8 Bot");
      .addField("1/25/2017", "Added bannedwords/filter");
      .addField("Commands List", "https://m8bot.js.org/#Commands");
    message.channel.send({
      embed: serverEmbed
    });
  } else {
    message.reply("You can't use that command in a DM!")
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'changelog',
  description: 'Shows changes made to M8 Bot.',
  usage: 'changelog'
};
