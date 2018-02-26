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
    return message.reply(`you must wait ~${cooldownProper} to work again!`)
    //return message.reply(`you must wait ~${cooldown.toString().slice(0, 4)} minutes to play again!`)
  }

  var workTypes = ["lawn", "clean", "prostitute", "lemonade", "sleep", "NASCAR", "crusade", "bbq", "lifeguard", "lawn", "lawn", "lawn", "clean", "clean", "clean", "bbq", "lifeguard"]
  var work = workTypes[Math.floor(Math.random() * workTypes.length)];

  function pay(wage) {
    userInfo.points = points + wage;
    userInfo.workTime = nowTime;
    client.userInfo.set(message.author.id, userInfo)
  }

  if (work == "lawn") {
    pay(2)
    message.channel.send(`${message.member.displayName} just finished mowing lawns and earned minimum wage! 2 ${settings.pointName} for you.`)
    return;
  }
  if (work == "clean") {
    pay(5)
    message.channel.send(`${message.member.displayName} just cleaned the bathroom, ewww. Take 5 ${settings.pointName} for your hard work!`)
    return;
  }
  if (work == "prostitute") {
    pay(10)
    message.channel.send(`The sexy ${message.member.displayName} just sold their body for a whoping 10 ${settings.pointName}.`)
    return
  }
  if (work == "sleep") {
    pay(0)
    message.channel.send(`⏰⏰ ${message.member.displayName} over slept and missed work!`)
    return
  }
  if (work == "NASCAR") {
    pay(8)
    message.channel.send(`🏎🏎 ${message.member.displayName} just put the pedal to the metal a NASCAR race. Considering all you did was turn left, 8 ${settings.pointName} seems a bit high.`)
    return
  }
  if (work == "lemonade") {
    pay(3)
    message.channel.send(`🍋🍋 ${message.member.displayName} sold some darn good lemonade at their stand. They made 3 ${settings.pointName} in profit.`)
    return
  }
  if (work == "crusade") {
    pay(10)
    message.channel.send(`⚔ **DEUS VULT** ⚔ ${message.member.displayName} has helped take back the holy land and stole 10 ${settings.pointName} from the people. ⚔ **DEUS VULT** ⚔`)
    return
  }
  if (work == "bbq") {
    pay(4)
    message.channel.send(`🍔🌭 ${message.member.displayName} just grilled at a dad's only BBQ. Everyone chipped in 4 ${settings.pointName} to thank you for your time.`)
  }
  if (work == "lifeguard") {
    pay(4)
    message.channel.send(`🏊 Wow, ${message.member.displayName} was the a lifeguard and there was only 1 casualty. 4 ${settings.pointName} for you.`)
  }

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