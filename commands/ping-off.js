exports.run = (client, message) => {
  message.delete();
  const settings = client.settings.get(message.guild.id);
  message.delete();
  message.channel.reply(`the ping-off command is no longer used. In order to turn the ping off, run "${settings.prefix}set edit livePing false".
  If you recive an error, you may need to run "${settings.prefix}set add livePing false.`)
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Administrator"
};

exports.help = {
  name: 'ping-off',
  description: 'Allows a server owner/admin to decide whether or not M8 Bot can use @here in that channel. Default is on.',
  usage: 'ping-off'
};
