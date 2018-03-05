exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
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

  var userInfo = client.userInfo.get(message.author.id)
  var points = parseInt(client.userInfo.get(message.author.id).points)
  var workTime = parseInt(client.userInfo.get(message.author.id).workTime)
  var nowTime = (new Date).getTime();

  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  if (nowTime - workTime < 1800000) {
    var timeDiff = nowTime - workTime
    var cooldown = (1800000 - timeDiff)
    var cooldownProper = millisToMinutesAndSeconds(cooldown)
    return message.reply(`you must wait ~${cooldownProper} to work again!\nYou can pay your 5 ${client.config.pointName} bypass and reset your cooldown, by typing ${serverSettings.prefix}earn-again`)
    //return message.reply(`you must wait ~${cooldown.toString().slice(0, 4)} minutes to play again!`)
  }

  function pay(wage) {
    userInfo.points = points + wage;
    userInfo.workTime = nowTime;
    client.userInfo.set(message.author.id, userInfo)
  }

  var workTypes = ["lawn", "clean", "prostitute", "lemonade", "sleep", "NASCAR", "crusade", "bbq", "lifeguard", "fisherman", "IT"]
  var work = workTypes[Math.floor(Math.random() * workTypes.length)];

  var workInfo = require("../assets/work.json")

  var messageToSend = (workInfo[work].message)
  var messageToSend = messageToSend.toString().replace("{user}", message.member.displayName).replace("{pointName}", settings.pointName)
  var ammount = workInfo[work].points
  pay(ammount);
  message.channel.send(messageToSend)
  return



};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "work",
  category: "Money",
  description: "Work hard for the money.",
  usage: "work"
};