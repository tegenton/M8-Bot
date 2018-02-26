const {
  SlotMachine,
  SlotSymbol
} = require("slot-machine");

const mixer = new SlotSymbol("mixer", {
  display: "<:mixer:416584701310926868>",
  points: 1,
  weight: 100
});
const twitch = new SlotSymbol("twitch", {
  display: "<:twitch:416584701181165569>",
  points: 1,
  weight: 100
});
const mappa = new SlotSymbol("mappa", {
  display: "<:mappa:416584032604782592>",
  points: 1,
  weight: 100
});
const kappa = new SlotSymbol("kappa", {
  display: "<:kappa:416584032600457216>",
  points: 1,
  weight: 100
});
const cherry = new SlotSymbol("cherry", {
  display: "🍒",
  points: 1,
  weight: 100
});
const goblin = new SlotSymbol("goblin", {
  display: "👺",
  points: 1,
  weight: 100
});
const light = new SlotSymbol("light", {
  display: "💡",
  points: 1,
  weight: 40,
  wildcard: true
});
const music = new SlotSymbol("music", {
  display: "🎵",
  points: 2,
  weight: 40
});
const heart = new SlotSymbol("heart", {
  display: "❤",
  points: 3,
  weight: 35
});
const pepe = new SlotSymbol("pepe", {
  display: "<:pepe:416581927399587843>",
  points: 4,
  weight: 30
});
const money = new SlotSymbol("money", {
  display: "💸",
  points: 5,
  weight: 25
});
const champagne = new SlotSymbol("champagne", {
  display: "🍾",
  points: 10,
  weight: 3
});
const jackpot = new SlotSymbol("jackpot", {
  display: "<:dankyKang:416577726695342087>",
  points: 50,
  weight: 5
});

const machine = new SlotMachine(3, [mixer, twitch, mappa, kappa, cherry, goblin, light, music, heart, pepe, money, champagne, jackpot]);

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const settings = require("../config.js");
  const Discord = require("discord.js");

  const serverSettings = client.settings.get(message.guild.id);
  if (!serverSettings.moneyCommands) {
    serverSettings.moneyCommands = "on"
    client.settings.set(message.guild.id, serverSettings)
  } else {
    if (serverSettings.moneyCommands == "off" || serverSettings.moneyCommands == "false") {
      return;
    }
  }

  // var userInfo = JSON.stringify(client.userInfo.get(message.author.id))
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

  if (points == 0) {
    return message.reply(`you neet at least 1 ${settings.pointName} to use the slot machine!`)
  }

  try {
    const results = machine.play();
    const score = results.totalPoints;
    if (results.winCount === 0) {
      var infoMessage = `${message.member.displayName} lost!`
    }
    // if (results.winCount ===)

    const slotsEmbed = new Discord.RichEmbed()
      .setTitle("M8 Bot Slots")
      .setColor(0x9900FF)
      .setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
      .setTimestamp()
      .setDescription()
      .setDescription(`${results.visualize(false)}\n\n${results.winCount === 0 ? `💩 ${message.member.displayName} lost at slots!\nTry again in 30 seconds if you're daring!\nYour current balance is ${points - 1} ${settings.pointName}.` : `Wow! ${message.member.displayName} won!`}\n\n${results.winCount === 0 ? "" : `You have won **${score.toLocaleString()}** ${settings.pointName}!\nYour current balance is ${points + score} ${settings.pointName}.`}`)

    message.channel.send({
      embed: slotsEmbed
    });

    if (results.winCount > 0) {
      userInfo.points = points + score;
      userInfo.gameTime = playTime;
      client.userInfo.set(message.author.id, userInfo)
    } else {
      userInfo.points = points - 1;
      userInfo.gameTime = playTime;
      client.userInfo.set(message.author.id, userInfo)
    }

    // if (results.winCount < 0) {
    //   userInfo.points = points - 1;
    //   userInfo.gameTime = playTime;
    //   client.userInfo.set(message.author.id, userInfo)
    // }

  } catch (e) {
    console.log(e);
  }



};


exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["slotmachine", "slot"],
  permLevel: "User"
};

exports.help = {
  name: "slots",
  category: "Money",
  description: "Pull the lever Kronk and test your luck at the M8 Bot Casino's slot machine!",
  usage: "slots"
};