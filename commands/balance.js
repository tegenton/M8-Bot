exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const Discord = require("discord.js");
  const settings = require("../config.js");

  const serverSettings = client.settings.get(message.guild.id);
  if (!serverSettings.moneyCommands) {
    serverSettings.moneyCommands = "on"
    client.settings.set(message.guild.id, serverSettings)
  } else {
    if (serverSettings.moneyCommands == "off" || serverSettings.moneyCommands == "false") {
      return;
    }
  }

  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }
  var userInfo = client.userInfo.get(message.author.id)
  var points = parseInt(client.userInfo.get(message.author.id).points)
  var gameTime = parseInt(client.userInfo.get(message.author.id).gameTime)
  var workTime = parseInt(client.userInfo.get(message.author.id).workTime)
  var nowTime = (new Date).getTime();

  var cooldownProperWork = `Can earn ${settings.pointName} now!`
  var cooldownProperGame = "Can play now!"

  if (nowTime - workTime < 1800000) {
    var timeDiff = nowTime - workTime
    var cooldownWork = (1800000 - timeDiff)
    var cooldownProperWork = millisToMinutesAndSeconds(cooldownWork)
  }
  if (nowTime - gameTime < 30000) {
    var timeDiff = nowTime - gameTime
    var cooldownGame = (30000 - timeDiff)
    var cooldownProperGame = millisToMinutesAndSeconds(cooldownGame)
  }

  const balEmbed = new Discord.RichEmbed()
    .setTitle(`${message.author.username}'s Balance`)
    .setColor(0x9900FF)
    .setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
    .setThumbnail(message.author.displayAvatarURL)
    .setTimestamp()
    .addField("Balance", `${points} ${settings.pointName}`, true)
    .addField("Earning Cooldown", cooldownProperWork, true)
    .addField("Game Cooldown", cooldownProperGame, true)
  message.channel.send({
    embed: balEmbed
  });


};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["bal", "money", "economy"],
  permLevel: "User"
};

exports.help = {
  name: "balance",
  category: "Money",
  description: "Check you balance and cooldowns.",
  usage: "bal"
};