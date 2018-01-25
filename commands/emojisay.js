const emojimap = {
  ' ': '   ',
  '0': ':zero:',
  '1': ':one:',
  '2': ':two:',
  '3': ':three:',
  '4': ':four:',
  '5': ':five:',
  '6': ':six:',
  '7': ':seven:',
  '8': ':eight:',
  '9': ':nine:',
  '!': ':grey_exclamation:',
  '?': ':grey_question:',
  '#': ':hash:',
  '*': ':asterisk:'
};

'abcdefghijklmnopqrstuvwxyz'.split('').forEach(c => {
  emojimap[c] = emojimap[c.toUpperCase()] = ` :regional_indicator_${c}:`;
});

exports.run = (client, message, args) => {
  message.delete();
  message.reply(
    args.join(' ')
    .split('')
    .map(c => emojimap[c] || c)
    .join('')
  );
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['emotesay', 'emosay'],
  permLevel: 0
};

exports.help = {
  name: 'emojisay',
  description: 'Say things in emoji!',
  usage: 'emojisay ____'
};
