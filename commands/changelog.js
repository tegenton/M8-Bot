exports.run = (client, message) => {
  const Discord = require("discord.js");
  message.delete();
  if (message.guild != null) {
    if (message.guild.iconURL = null) {
      var iconURL = "http://m8bot.js.org/img/profile.png";
    } else {
      var iconURL = message.guild.iconURL;
    }
    const serverEmbed = new Discord.RichEmbed()
      .setTitle(message.guild.name)
      .setColor(0x9900FF)
      .setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
      .setThumbnail("http://m8bot.js.org/img/profile.png")
      .setTimestamp()
      .addField("M8 Bot | Change Log", "See changes that been added/removed/fixed.")
      .addField("1/25/2018", "Added Bannedwords/Filter to !set view")
      .addField("1/26/2018", "Added !anime <search-name> This will search the MAL Database \nAdded 'known issues' to !m8bug \nRemoved !tank command as no longer needed")
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

//Dev Notes: Please update change logs when changes are added/removed/fixed on M8 Bot.
