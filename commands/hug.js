exports.run = (client, message) => {
  message.delete();
  const settings = client.settings.get(message.guild.id);

  if (message.content.startsWith(settings.prefix + "hugs ")) {
    var who = message.content.replace(settings.prefix + "hugs ", "")
  }
  if (message.content.startsWith(settings.prefix + "hug ")) {
    var who = message.content.replace(settings.prefix + "hug ", "")
  }
  message.channel.send(message.author + " gave " + who + " a nice, big, hug!");
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['hugs'],
  permLevel: 0
};

exports.help = {
  name: 'hug',
  description: 'Wanna give someone a hug? Do it then!',
  usage: 'hug ___'
};
