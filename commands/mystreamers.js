exports.run = (client, message) => {
  message.delete();
  var userDirMixer = __dirname.replace("commands", "users")
  var userDirTwitch = __dirname.replace("commands", "users_twitch")

  const streamerFolderMixer = userDirMixer;
  const streamerFolderTwitch = userDirTwitch;

  const fs = require('fs');
  var chatID = message.channel.id;
  fs.readdir(streamerFolderMixer, (err, files) => {
    files.forEach(file => {
      var files = file
    });
    var fileCount = files.length
    var myStreamersMixer = "Current **Mixer** Streamer List:\n"
    for (i = 0; i < fileCount; i++) {
      var serverList = fs.readFileSync(streamerFolderMixer + "/" + files[i])
      if (serverList.includes(chatID)) {
        var name = files[i].replace(".txt", "")
        var myStreamersMixer = myStreamersMixer + name + "\n"
      }
    }
    message.channel.send(myStreamersMixer)
  })


  fs.readdir(streamerFolderTwitch, (err, files) => {
    files.forEach(file => {
      var files = file
    });
    var fileCount = files.length
    var myStreamersTwitch = "Current **Twitch** Streamer List:\n"
    for (i = 0; i < fileCount; i++) {
      var serverList = fs.readFileSync(streamerFolderTwitch + "/" + files[i])
      if (serverList.includes(chatID)) {
        var name = files[i].replace(".txt", "")
        var myStreamersTwitch = myStreamersTwitch + name + "\n"
      }
    }
    message.channel.send(myStreamersTwitch)
  })
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'mystreamers',
  description: 'Lists all streamers registered to a text channel.',
  usage: 'mystreamers'
};
