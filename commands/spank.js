//Requested by DragonWarrior


exports.run = async (client, message) => {
  message.delete();
  const settings = await client.getSettings(message.guild.id);
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
