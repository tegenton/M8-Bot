exports.run = (client, message) => {
  const settings = client.settings.get(message.guild.id);
  const args = message.content.split(" ").slice(1);
  if (args[0] == null) {
    var option = "bad"
  } else {
    var option = args[0].toString()
  }
  var serverSettings = client.settings.get(message.guild.id)

  if (option == "bad") {
    message.reply(`the valid settings options are **on** and **off**.`)
    return;
  }

  if (option.toString().toLowerCase() == "off") {
    serverSettings.livePing = false
    client.settings.set(message.guild.id, serverSettings)
    message.reply(`the live ping has been disabled.`)
    return;
  }
  if (option.toString().toLowerCase() == "on") {
    serverSettings.livePing = true
    client.settings.set(message.guild.id, serverSettings)
    message.reply(`the live ping has been enabled.`)
    return;
  } else {
    message.reply(`${option} is not a valid setting. The valid settings options are **on** and **off**.`)
    return;
  }
}


exports.conf = {
  enabled: false,
  guildOnly: true,
  aliases: [],
  permLevel: "Administrator"
};

exports.help = {
  name: 'liveping',
  description: 'Allows a server owner/admin to decide whether or not M8 Bot can use @here in that channel. Default is on.',
  usage: 'liveping'
};
