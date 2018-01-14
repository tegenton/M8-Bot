exports.run = (client, message) => {
  message.delete();
  var say = message.content.replace("!m8say ", "")
  message.channel.send(say)
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Admin"
};

exports.help = {
  name: 'm8say',
  description: '',
  usage: ''
};
