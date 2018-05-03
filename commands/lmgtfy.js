exports.run = async (client, message) => {
  message.delete();
  const settings = await client.getSettings(message.guild.id);

  if (message.content.startsWith(settings.prefix + "lmgtfy")) {
    var term = message.content.replace(settings.prefix + "lmgtfy ", "");
  }
  if (message.content.startsWith(settings.prefix + "google")) {
    var term = message.content.replace(settings.prefix + "google ", "");
  }
  if (message.content.startsWith(settings.prefix + "search")) {
    var term = message.content.replace(settings.prefix + "search ", "");
  }
  var spaces = term.split(" ");
  var input = term.replace(" ", "+");
  for (i = 0; i < spaces.length; i++) {
    var input = input.replace(" ", "+");
  }
  message.channel.send("Here's your google link " + message.author + " - http://lmgtfy.com/?q=" + input);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['google', 'search'],
  permLevel: 0
};

exports.help = {
  name: 'lmgtfy',
  description: 'Gets a Let Me Google That For You link for any term you want.',
  usage: 'lmgtfy ___'
};
