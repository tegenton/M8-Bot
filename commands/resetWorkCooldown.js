exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  const serverSettings = await client.getSettings(message.guild.id);
  if (!serverSettings.moneyCommands) {
    serverSettings.moneyCommands = "on"
    client.settings.set(message.guild.id, serverSettings)
  } else {
    if (serverSettings.moneyCommands == "off" || serverSettings.moneyCommands == "false") {
      return;
    }
  }

  const userInfo = await client.getUserInfo(message.author.id);
  var points = parseInt(userInfo.points)
  var workTime = parseInt(userInfo.workTime)
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

    userInfo.points = points - 5;
    userInfo.workTime = 0;
    client.userInfo.get(message.author.id).update({ "userInfo": userInfo }).run();

    return message.reply(`you just spent 5 ${client.config.pointName} to reset your earning cooldown, which was ~${cooldownProper} long.`)

  } else {
    return message.reply(`no need to waste 5 ${client.config.pointName} on resetting your cooldown, it's already at zero.`)
  }

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["reset-work", "reset-earnings", "bail", "workagain", "work-again", "earnagain", "earn-again"],
  permLevel: "User"
};

exports.help = {
  name: "resetwork",
  category: "Money",
  description: "Used to reset the earning cooldown for 5 Glix",
  usage: "resetwork"
};
