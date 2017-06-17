exports.run = (client, message) => {
  message.delete();

    message.channel.send("http://i.imgur.com/CVHyMXt.png");

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'rawr',
  description: "I'm a meme.",
  usage: '!rawr'
};
