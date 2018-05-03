exports.run = (client, message) => {
  var fs = require("fs");
  message.delete();
  var rootDir = __dirname.replace("commands", "")
  var streamersRaw = fs.readFileSync(rootDir + "./mixerStreamers.txt", "utf-8");
  var streamersRawTwitch = fs.readFileSync(rootDir + "./twitchStreamers.txt", "utf-8");
  var streamers = streamersRaw.split(", ");
  var streamersTwitch = streamersRawTwitch.split(", ");
  var streamerCount = streamers.length;
  var streamerCountTwitch = streamersTwitch.length;
  message.channel.send("**Current List of Our " + streamerCount + " Mixer Streamers**\n", {
    file: rootDir + "./mixerStreamers.txt"
  })
  message.channel.send("**Current List of Our " + streamerCountTwitch + " Twitch Streamers**\n", {
    file: rootDir + "./twitchStreamers.txt"
  })
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['all-streamers'],
  permLevel: "Bot Support"
};

exports.help = {
  name: 'allstreamers',
  description: 'Pulls a list of all the streamers that the bot stalks.',
  usage: 'allstreamers'
};
