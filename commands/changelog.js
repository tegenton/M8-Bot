exports.run = (client, message) => {
  const Discord = require("discord.js");
  message.delete();
  if (message.guild != null) {
    if (message.guild.iconURL = null) {
      var iconURL = "https://m8bot.js.org/img/profile.png";
    } else {
      var iconURL = message.guild.iconURL;
    }
    const serverEmbed = new Discord.RichEmbed()
      .setTitle(message.guild.name)
      .setColor(0x9900FF)
      .setFooter("Sent via M8 Bot", "http://i.imgur.com/nXvRJXM.png")
      .setThumbnail("http://i.imgur.com/nXvRJXM.png")
      .setTimestamp()
      .addField("M8 Bot | Change Log", "See changes that been added/removed/fixed.")
      .addField("Change Log | 1/25/2018", "Added Bannedwords/Filter to !set view")
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
  description: 'Get info about changes to M8 Bot.',
  usage: 'changelog'
};
