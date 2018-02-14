exports.run = (client, message) => {
  const settings = client.settings.get(message.guild.id);
  message.delete();
  message.channel.reply(`the ping-on command is no longer used. In order to  turn the ping on, run "${settings.prefix}set edit livePing true".
  If you recive an error, you may need to run "${settings.prefix}set add livePing true.`)
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Administrator"
};

exports.help = {
  name: 'ping-on',
  description: 'Allows a server owner/admin to decide whether or not M8 Bot can use @here in that channel. Default is on.',
  usage: 'ping-on'
};
