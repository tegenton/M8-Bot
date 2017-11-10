exports.run = (client, message) => {
  message.delete();
  message.channel.send(`Sorry ${message.author.toString()}, my music features are currently offline at the moment.`);
};

exports.conf = {
  enabled: false,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'play',
  description: 'Displays music feature information.',
  usage: 'play'
};
