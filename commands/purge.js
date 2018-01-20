exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const settings = client.settings.get(message.guild.id);

  var count = message.content.replace(settings.prefix + "purge", "")
  if (message.guild.member(client.user).hasPermission(
      "MANAGE_MESSAGES"
    ) == true) {
    if (isNaN(count)) {
      message.reply("❌ Please follow the purge command with a number from 1 to 100!");
    }
    if (!isNaN(count)) {
      if (count <= 0) {
        message.reply("I am unable to purge 0 or less messages!")
      }
      if (count >= 1 && count <= 100) {
        message.channel.bulkDelete(count)
        message.channel.send(`☑ Purged ${count} message(s) from ${message.channel.name}`)
      }
      if (count > 100) {
        message.reply("❌ I can only purge up to 100 messages at a time!")
      }

    }
  }
  if (message.guild.member(client.user).hasPermission(
      "MANAGE_MESSAGES"
    ) == false) {
    message.channel.send("I am unable to use the purge function as I do not have the Manage Messages premission!")
  }


};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "purge",
  description: "Deletes messages in bulk",
  usage: "purge person # or purge #"
};
