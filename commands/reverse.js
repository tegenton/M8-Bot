exports.run = async (client, message, args) => {
  message.delete();
  if (args.length < 1) {
    message.reply("I can't reverse nothing... GIVE ME MORE!");
  } else {
    message.reply(args.join(' ').split('').reverse().join(''));
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["backwards"],
  permLevel: 0
};

exports.help = {
  name: 'reverse',
  description: 'Reverses text',
  usage: 'reverse ____'
};
