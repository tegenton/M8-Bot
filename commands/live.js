exports.run = (client, message) => {
  const Discord = require("discord.js");
  require('discord.js-aliases');
  var fs = require("fs");
  var userDir = __dirname.replace("commands", "users");
  var rootDir = __dirname.replace("commands", "");
  var timeDir = __dirname.replace("commands", "user_time");
  const settings = require(rootDir + "/config.js");



  if ((message.content.startsWith("!live") && message.author.id == "401967977228009473") || //if the bot sends the message
    (message.content.startsWith("!live") && message.author.id == "145367010489008128" && message.channel.id == "275344557674201089")) { //if comixs sends the message (and in certian chat)
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
              .setTitle(mixerInfo.token + "\'s Stream")
              .setAuthor(mixerInfo.name)
              .setColor(0x9900FF)
              .setDescription("Hey guys, " + mixer + " is live right now! Click above to watch!")
              .setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
              .setThumbnail(mixerInfo.user.avatarUrl)
              .setTimestamp()
              .setURL("http://mixer.com/" + mixer)
              .addField("Streaming", game, true)
              .addField("Followers", mixerInfo.numFollowers, true)
              .addField("Mixer Level", mixerInfo.user.level, true)
              .addField("Total Views", mixerInfo.viewersTotal, true);
            var serversAllowedRaw = fs.readFileSync(userDir + "/" + mixer + ".txt", "utf-8"); //get the list of servers they are allowed to ne announced on
            var serversAllowed = serversAllowedRaw.split(", "); //splits the servers into individual strings
            for (i = 0; i < serversAllowed.length; i++) { //run for the total number of servers they are allowed on

              if (client.channels.map(c => c.id).includes(serversAllowed[i])) {

                var liveMessage = "";
                var guildID = client.channels.get(serversAllowed[i]).guild.id
                const settings = client.settings.get(guildID);
                if (!settings.livePing || settings.livePing == "true") {
                  var liveMessage = liveMessage + "@here, "
                }
                if (!settings.liveMixerMessage) {
                  var liveMessage = liveMessage + mixer + " is now live on Mixer!"
                } else {
                  var liveMessage = liveMessage + settings.liveMixerMessage.replace("{{streamer}}", mixer)
                }

                client.channels.get(serversAllowed[i]).sendEmbed(liveEmbed, liveMessage); //send the live message to servers
              }
            }
          } else { //if there is a game set
            var game = mixerInfo.type.name; //set the game var to the streamer's game
            // if (game = "PLAYERUNKNOWN'S BATTLEGROUNDS") {
            //   var game = "PUBG"
            // }
            const liveEmbed = new Discord.RichEmbed() //start the embed message template
              .setTitle(mixerInfo.token + "\'s Stream")
              .setAuthor(mixerInfo.name)
              .setColor(0x9900FF)
              .setDescription("Hey guys, " + mixer + " is live right now! Click above to watch!")
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
                var liveMessage = "";
                var guildID = client.channels.get(serversAllowed[i]).guild.id
                const settings = client.settings.get(guildID);
                if (!settings.livePing || settings.livePing == "true") {
                  var liveMessage = liveMessage + "@here, "
                }
                if (!settings.liveMixerMessage) {
                  var liveMessage = liveMessage + mixer + " is now live on Mixer!"
                } else {
                  var liveMessage = liveMessage + settings.liveMixerMessage.replace("{{streamer}}", mixer)
                }
                client.channels.get(serversAllowed[i]).sendEmbed(liveEmbed, liveMessage); //send the live message to servers
              }
            }



          }
        }
      });
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: "live",
  description: "Force a live announcement.",
  usage: "live ___"
};
