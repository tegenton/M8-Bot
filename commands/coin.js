exports.run = (client, message) => {
  message.delete();

  var coin = (Math.floor(Math.random() * 2))
  if (coin == 0) {
    message.channel.send("The coin landed on heads.")
  } else {
    message.channel.send("The coin landed on tails.")
  }


};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['coinflip', 'coin-flip', 'flip'],
  permLevel: 0
};

exports.help = {
  name: 'coin',
  description: 'Flips a coin.',
  usage: '!coin'
};
