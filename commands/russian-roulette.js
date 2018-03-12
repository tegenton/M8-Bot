exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

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
  var gameTime = parseInt(client.userInfo.get(message.author.id).gameTime)
  var playTime = (new Date).getTime();

  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }
  if (playTime - gameTime < 30000) {
    var timeDiff = playTime - gameTime
    var cooldown = (30000 - timeDiff)
    var cooldownProper = millisToMinutesAndSeconds(cooldown)
    return message.reply(`you must wait ~${cooldownProper} to play again!`)
    //return message.reply(`you must wait ~${cooldown.toString().slice(0, 4)} minutes to play again!`)
  }
  if (points < 50) {
    return message.reply(`you neet at least 50 ${client.config.pointName} to play Russian Roulette!`)
  }

  message.channel.send(`Hold on there ${message.member.displayName}, are you sure you wanna go through with this? If you loose, **you will loose all** of your ${client.config.pointName}!\nReply with ` + "`continue` to continue, or `stop` to cancel.");
  return message.channel.awaitMessages(m => m.author.id === message.author.id, {
    "errors": ["time"],
    "max": 1,
    time: 30000
  }).then(resp => {
    if (!resp) return;
    resp = resp.array()[0];
    const validAnswers = ["continue", "yes", "y", "no", "n", "cancel", "stop"];
    if (validAnswers.includes(resp.content)) {
      if (resp.content === "cancel" || resp.content === "no" || resp.content === "n" || resp.content === "stop") {
        return message.channel.send(`🐔🐔 Looks like ${message.member.displayName} was a chicken and backed down.`);
      } else if (resp.content === "yes" || resp.content === "y" || resp.content === "continue") {

        var random = Math.floor(Math.random() * 5);

        if (random === 0) { //if lost
          userInfo.points = 0
          userInfo.gameTime = playTime;
          client.userInfo.set(message.author.id, userInfo)
          return message.channel.send(`‼**BANG**‼ ${message.member.displayName} was unlucky. The bullet went straight through their head.`)
        } else { //if won
          var randomG = Math.floor(Math.random() * 100) + 1;
          userInfo.points = points + randomG
          userInfo.gameTime = playTime;
          client.userInfo.set(message.author.id, userInfo)
          return message.channel.send(`🍀🍀 ${message.member.displayName} was lucky. There was no bullet this time. They got ${randomG} ${client.config.pointName}`)
        }



      }
    } else {
      message.channel.send(`Only \`${validAnswers.join("`, `")}\` are valid, please supply one of those next time.`).catch(error => console.error(error));
    }
  }).catch(error => {
    console.error(error);
  });

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["roulette", "russianroulette"],
  permLevel: "User"
};

exports.help = {
  name: "russian-roulette",
  category: "Money",
  description: "Gable it all",
  usage: "roulette"
};