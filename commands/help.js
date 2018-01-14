exports.run = (client, message) => {
  const Discord = require("discord.js");
  const settings = require("../config.js");
  message.delete();
  const helpEmbed = new Discord.RichEmbed()
    .setTitle("M8 Bot Help Version " + settings.version)
    .setColor(0x9900FF)
    .setFooter("Sent via M8 Bot", "http://i.imgur.com/nXvRJXM.png")
    .setThumbnail("http://i.imgur.com/nXvRJXM.png")
    .setTimestamp()
    .addField("Help Page", "A full list of commands can be found at https://m8bot.js.org/#info.");
  message.channel.send({
    embed: helpEmbed
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["m8bothelp", "helpm8bot", "help m8bot", "help"],
  permLevel: "User"
};

exports.help = {
  name: "help",
  category: "System",
  description: "Displays all the available commands for your permission level.",
  usage: "help [command]"
};
