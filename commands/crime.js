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
    return message.reply(`you must wait ~${cooldownProper} to commit another crime!`)
    //return message.reply(`you must wait ~${cooldown.toString().slice(0, 4)} minutes to play again!`)
  }

  var crimeTypes = ["bank", "drugs", "pirate", "bank", "bank", "bank", "drugs", "drugs", "drugs", "drugs", "pirate", "pirate"]
  var fail = ["fail", "fail", "fail", "fail", "fail", "fail", "fail", "fail", "fail", "fail", "fail", "fail", "fail", "fail", "fail"]
  var typesAndFail = crimeTypes.concat(fail)

  var crime = typesAndFail[Math.floor(Math.random() * (crimeTypes.length + fail.length))];

  function pay(wage) {
    userInfo.points = points + wage;
    userInfo.workTime = nowTime;
    client.userInfo.set(message.author.id, userInfo)
  }

  if (crime == "bank") {
    pay(10)
    message.channel.send(`💰💰 ${message.member.displayName} just robbed a bank and got away with 10 ${settings.pointName}!`)
    return;
  }
  if (crime == "drugs") {
    pay(8)
    message.channel.send(`${message.member.displayName} just sold some drugs at the local highschool. They turned 8 ${settings.pointName} in profit!`)
    return;
  }
  if (crime == "pirate") {
    pay(12)
    message.channel.send(`<a:animeDance:417113750223716362><a:animeDance:417113750223716362> ${message.member.displayName} just sold some pirated anime on the streets for 12 ${settings.pointName}.`)
    return
  }
  if (crime == "fail") {
    pay(0)
    var failType = Math.floor(Math.random() * 3) + 1;
    if (failType == 1){
      message.channel.send(`🚓🚓 ${message.member.displayName} was caught trying to rob the bank!`)
    }
    if (failType == 2){
      message.channel.send(`🚓🚓 ${message.member.displayName} was caught trying to sell drugs!`)
    }
    if (failType == 3){
      message.channel.send(`🚓🚓 ${message.member.displayName} was caught trying to sell stolen anime!`)
    }
    return
  }
  // if (crime == "NASCAR") {
  //   pay(8)
  //   message.channel.send(`🏎🏎 ${message.member.displayName} just put the pedal to the metal a NASCAR race. Considering all you did was turn left, 8 ${settings.pointName} seems a bit high.`)
  //   return
  // }
  // if (crime == "lemonade") {
  //   pay(3)
  //   message.channel.send(`🍋🍋 ${message.member.displayName} sold some darn good lemonade at their stand. They made 3 ${settings.pointName} in profit.`)
  //   return
  // }
  // if (crime == "crusade") {
  //   pay(10)
  //   message.channel.send(`⚔ **DEUS VULT** ⚔ ${message.member.displayName} has helped take back the holy land and stole 5 ${settings.pointName} from the people. ⚔ **DEUS VULT** ⚔`)
  //   return
  // }
  // if (crime == "bbq") {
  //   pay(4)
  //   message.channel.send(`🍔🌭 ${message.member.displayName} just grilled at a dad's only BBQ. Everyone chipped in 4 ${settings.pointName} to thank you for your time.`)
  // }
  // if (crime == "lifeguard") {
  //   pay(4)
  //   message.channel.send(`🏊 Wow, ${message.member.displayName} was the a lifeguard and there was only 1 casualty. 4 ${settings.pointName} for you.`)
  // }

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