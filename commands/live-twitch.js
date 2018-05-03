exports.run = async (client, message) => {
  const Discord = require("discord.js");
  require('discord.js-aliases');
  var fs = require("fs");
  var userDir = __dirname.replace("commands", "twitch");
  var rootDir = __dirname.replace("commands", "");
  var timeDir = __dirname.replace("commands", "twitch_time");
  const settings = require(rootDir + "/config.js");


  const args = message.content.split(" ").slice(1); //seperate command into args
  const twitch = args[0]; //twitch name is arg 0
  if (fs.existsSync(userDir + "/" + twitch + ".txt")) { //varifies that the streamer is on record
    var request = require("request"); //sets a var to request info
    request("https://api.twitch.tv/kraken/channels/" + twitch + "?client_id=" + settings.twitch_id, function(error, response, body) { //request streamer's in in JSON form
      if (!error && response.statusCode == 200) { //if there is no error
        var twitchInfo = JSON.parse(body); //sets twitchInfo to the JSON data
        if (twitchInfo.game == null) { //if there is no game set to the stream
          var game = "[API ERROR]"; //set the game to the meme game
        } else { //if there is a game set
          var game = twitchInfo.game; //set the game var to the streamer's game
          // if (game = "PLAYERUNKNOWN'S BATTLEGROUNDS") {
          //   var game = "PUBG"
          // }
        }
        const liveEmbed = new Discord.RichEmbed() //start the embed message template
          .setTitle(twitchInfo.display_name + "\'s Stream")
          .setAuthor(twitchInfo.status)
          .setColor(0x9900FF)
          .setDescription("Hey guys, " + twitch + " is live right now! Click above to watch!")
          .setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
          .setThumbnail(twitchInfo.logo)
          .setTimestamp()
          .setURL("http://twitch.tv/" + twitch)
          .addField("Streaming", game)
          .addField("Followers", twitchInfo.followers, true)
          .addField("Total Views", twitchInfo.views, true); //end the embed message template
        var serversAllowedRaw = fs.readFileSync(userDir + "/" + twitch + ".txt", "utf-8"); //get the list of servers they are allowed to ne announced on
        var serversAllowed = serversAllowedRaw.split(", "); //splits the servers into individual strings
        for (i = 0; i < serversAllowed.length; i++) { //run for the total number of servers they are allowed on
          if (client.channels.map(c => c.id).includes(serversAllowed[i])) {

            var liveMessage = "";
            var guildID = client.channels.get(serversAllowed[i]).guild.id
            const settings = client.getSettings(guildID);
            if (!settings.livePing || settings.livePing == "true") {
              var liveMessage = liveMessage + "@here, "
            }
            if (!settings.liveTwitchMessage) {
              var liveMessage = liveMessage + twitchInfo.display_name + " is now live on Twitch!"
            } else {
              var liveMessage = liveMessage + settings.liveTwitchMessage.replace("{{streamer}}", twitchInfo.display_name)
            }
            client.channels.get(serversAllowed[i]).sendEmbed(liveEmbed, liveMessage); //send the live message to servers
          }
        }
      }
    });
  }

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Support"
};

exports.help = {
  name: "live-twitch",
  description: "Force a live announcement.",
  usage: "live-twitch ___"
};
