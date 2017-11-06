//Requested by @t0nyanator on twitch

exports.run = (client, message) => {
  message.delete();
  message.channel.send(`${message.author.toString()}, Here is your request for **CornPorn** https://imgur.com/gallery/3D9LAZG`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['cp'],
  permLevel: 0
};

exports.help = {
  name: 'cornporn',
  description: 'A command for your cornporn needs.',
  usage: 'cornporn'
};
