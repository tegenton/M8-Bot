//Requested by DragonWarrior
const settings = require(rootDir + './settings.json');

exports.run = (client, message) => {
  message.delete();
    var who = message.content.replace(settings.prefix + "spank ", "")

  message.channel.send(message.author + " spanked " + who + " with a spiked paddle!");
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'spank',
  description: 'Wanna give someone a spanking? Do it then!',
  usage: 'spank ___'
};
