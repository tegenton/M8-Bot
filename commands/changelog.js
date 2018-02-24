const {
  inspect
} = require("util");

exports.run = (client, message) => {
  const Discord = require("discord.js");
  message.delete();
  var changelog = inspect(client.settings.get("352984490693623829").changelog)
  var changelogText = changelog.substr(1).slice(0, -1).split(" ")
  var date = changelogText[0]
  var change = changelogText.slice(1)
    const changeEmbed = new Discord.RichEmbed()
      .setTitle(`M8 Bot Changelog`)
      .setColor(0x9900FF)
      .setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
      .setThumbnail("http://m8bot.js.org/img/profile.png")
      .setTimestamp()
      .addField(`${date}`, change.join(" "))
      //.addField("Previous Change Log | 1/25/2018", "Added Bannedwords/Filter to !set view \nAdded !anime <search-name> This will search the MAL Database \nAdded 'known issues' to !m8bug \nRemoved !tank command as no longer needed")
      //.addField("2/5/2018", "Removed !cornporn - no longer needed")
    message.channel.send({
      embed: changeEmbed
    });

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["change"],
  permLevel: 0
};

exports.help = {
  name: 'changelog',
  description: 'Get info about changes to M8 Bot.',
  usage: 'changelog'
};

//Dev Notes: Please update change logs when changes are added/removed/fixed on M8 Bot.
