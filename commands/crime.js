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
    return message.reply(`you must wait ~${cooldownProper} to commit another crime!\nYou can pay your 5 ${client.config.pointName} bypass and reset your cooldown, buy typing ${serverSettings.prefix}earn-again`)
    //return message.reply(`you must wait ~${cooldown.toString().slice(0, 4)} minutes to play again!`)
  }

  function pay(wage) {
    userInfo.points = points + wage;
    userInfo.workTime = nowTime;
    client.userInfo.set(message.author.id, userInfo)
  }

  var crimeTypes = ["bank", "drugs", "pirate", "hack", "streets", "bikes", "mail"]

  var chance = ["pass", "pass", "pass", "pass", "fail", "fail", "fail", "fail", "fail", "fail"]
  //40% chance to pass, 60% to fail

  var crime = chance[Math.floor(Math.random() * (chance.length))]

  var crimesAndFails = require("../assets/crime.json")

  if (crime == "pass") {
    var crime = crimeTypes[Math.floor(Math.random() * (crimeTypes.length))]
    var messageToSend = (crimesAndFails.crime[crime].message)
    var messageToSend = messageToSend.toString().replace("{user}", message.member.displayName).replace("{pointName}", settings.pointName)
    var ammount = crimesAndFails.crime[crime].points
    pay(ammount);
    message.channel.send(messageToSend)
    return
  }
  if (crime == "fail") {
    var fail = (Math.floor((Math.random() * 7) + 1)).toString();
    var messageToSend = (crimesAndFails.fail[fail])
    var messageToSend = messageToSend.toString().replace("{user}", message.member.displayName)
    pay(0);
    message.channel.send(messageToSend + `\nYou can pay your 5 ${client.config.pointName} bail and reset your cooldown, buy typing ${serverSettings.prefix}bail`)
    return;
  }


};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["heist"],
  permLevel: "User"
};

exports.help = {
  name: "crime",
  category: "Money",
  description: "Work hard for the money.",
  usage: "crime"
};