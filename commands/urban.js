exports.run = async (client, message) => {
  const settings = await client.getSettings(message.guild.id);

  if (message.channel.nsfw == false){
    return message.reply('due to Discord bot rules, urban can only be used in NSFW channels, as the content of the command may not be appreciate for all ages.')
  }

  if (message.content.startsWith(settings.prefix + "define")) {
    var term = message.content.replace(settings.prefix + "define ", "");
  }
  if (message.content.startsWith(settings.prefix + "urban")) {
    var term = message.content.replace(settings.prefix + "urban ", "");
  }
  if (message.content.startsWith(settings.prefix + "def")) {
    var term = message.content.replace(settings.prefix + "def ", "");
  }
  var request = require("request");
  request("http://api.scorpstuff.com/urbandictionary.php?term=" + term, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var def = body;
      message.channel.send(def);
    }
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['define', 'def'],
  permLevel: 0
};

exports.help = {
  name: 'urban',
  description: 'Get the urban definition of a word.',
  usage: 'urban ___'
};
