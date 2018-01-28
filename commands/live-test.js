exports.run = (client, message) => {
  const Discord = require("discord.js");
  require('discord.js-aliases');
  var userDir = __dirname.replace("commands", "users");
  var fs = require("fs");
  const serverSettings = client.settings.get(message.guild.id);

  // if ((message.content.startsWith(serverSettings.prefix + "live-test") && message.author.id == "401967977228009473") || //if the bot sends the message
  //   (message.content.startsWith(serverSettings.prefix + "live-test") && message.author.id == "145367010489008128" && message.channel.id == "401967908739088384") || //if comixs sends the message (and in certian chat)
  //   (message.content.startsWith(serverSettings.prefix + "live-test") && message.author.id == "161556067954720768" && message.channel.id == "401967908739088384")) { //if evil sends the message (and in certian chat)
  const args = message.content.split(" ").slice(1); //seperate command into args
  const mixer = args[0]; //mixer name is arg 0
  if (fs.existsSync(userDir + "/" + mixer + ".txt")) { //varifies that the streamer is on record
    var request = require("request"); //sets a var to request info
    request("https://mixer.com/api/v1/channels/" + mixer, function(error, response, body) { //request streamer's in in JSON form
      if (!error && response.statusCode == 200) { //if there is no error
        var mixerInfo = JSON.parse(body); //sets mixerInfo to the JSON data
        if (mixerInfo.type == null) { //if there is no game set to the stream
          var game = "[API ERROR]"; //set the game to the meme game
          const liveEmbed = new Discord.RichEmbed() //start the embed message template
            .setTitle("Test for " + mixerInfo.token + "\'s Stream")
            .setAuthor(mixerInfo.name)
            .setColor(0x9900FF)
            .setDescription("Hey guys this is a test for, " + mixer + "'s stream. This was requested by either a server owner, or " + mixer + ".")
            .setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
            .setThumbnail(mixerInfo.user.avatarUrl)
            .setTimestamp()
            .setURL("http://mixer.com/" + mixer)
            .addField("Streaming", game, true)
            .addField("Followers", mixerInfo.numFollowers, true)
            .addField("Mixer Level", mixerInfo.user.level, true)
            .addField("Total Views", mixerInfo.viewersTotal, true); //end the embed message template
          var serversAllowedRaw = fs.readFileSync(userDir + "/" + mixer + ".txt", "utf-8"); //get the list of servers they are allowed to ne announced on
          var serversAllowed = serversAllowedRaw.split(", "); //splits the servers into individual strings
          for (i = 0; i < serversAllowed.length; i++) { //run for the total number of servers they are allowed on
            if (client.channels.map(c => c.id).includes(serversAllowed[i])) {
              client.channels.get(serversAllowed[i]).sendEmbed(liveEmbed, "This is a test for " + mixer + "'s stream. This was requested by either a support agent or developer."); //send the live message to servers
            }
          }
        } else { //if there is a game set
          var game = mixerInfo.type.name; //set the game var to the streamer's game
          // if (game = "PLAYERUNKNOWN'S BATTLEGROUNDS") {
          //   var game = "PUBG"
          // }
          const liveEmbed = new Discord.RichEmbed() //start the embed message template
            .setTitle("Test for " + mixerInfo.token + "\'s Stream")
            .setAuthor(mixerInfo.name)
            .setColor(0x9900FF)
            .setDescription("Hey guys this is a test for, " + mixer + "'s stream. This was requested by either a support agent or developer.")
            .setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
            .setThumbnail(mixerInfo.user.avatarUrl)
            .setTimestamp()
            .setURL("http://mixer.com/" + mixer)
            .addField("Streaming", game, true)
            .addField("Followers", mixerInfo.numFollowers, true)
            .addField("Mixer Level", mixerInfo.user.level, true)
            .addField("Total Views", mixerInfo.viewersTotal, true)
            .setImage(mixerInfo.type.backgroundUrl); //end the embed message template
          var serversAllowedRaw = fs.readFileSync(userDir + "/" + mixer + ".txt", "utf-8"); //get the list of servers they are allowed to ne announced on
          var serversAllowed = serversAllowedRaw.split(", "); //splits the servers into individual strings
          for (i = 0; i < serversAllowed.length; i++) { //run for the total number of servers they are allowed on
            if (client.channels.map(c => c.id).includes(serversAllowed[i])) {
              client.channels.get(serversAllowed[i]).sendEmbed(liveEmbed, "This is a test for " + mixer + "'s stream. This was requested by either a support agent or developer."); //send the live message to servers
            }
          }
        }
      }
    });
  }
  //  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Support"
};

exports.help = {
  name: "live-test",
  description: "Send a test announcement.",
  usage: "live-test ___"
};

//.setDescription("Hey guys this is a test for, " + mixer + "'s stream. This was requested by either a server owner, or " + mixer + ".")
