// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = (client, message) => {
  const Discord = require("discord.js");

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if (message.author.bot && message.author.id != client.config.liveID) return;

  // Grab the settings for this server from the PersistentCollection
  // If there is no guild, get default conf (DMs)
  const settings = message.guild ?
    client.settings.get(message.guild.id) :
    client.config.defaultSettings;

    var defaultUser = {
      points: 10,
      workTime: 0,
      gameTime: 0,
      inventory: {}
    }

    if (client.userInfo.get(message.author.id) == null){
      client.userInfo.set(message.author.id, defaultUser); //add them to the database
    }

    //const userInfo = client.userInfo.get(message.author.id)


    // else {
    //   const newUserInfo = 1 + parseInt(client.userInfo.get(message.author.id))
    //   client.userInfo.set(message.author.id, newUserInfo)
    //   message.reply(newUserInfo)
    // }

  // For ease of use in commands and functions, we'll attach the settings
  // to the message object, so `message.settings` is accessible.
  message.settings = settings;

  // Banned words filter

  if (settings.bannedWords != null) {
    //message.reply(client.permlevel(message))
    if (client.permlevel(message) <= "3") {
      var badWords = settings.bannedWords.toString().toLowerCase().split(", ");
      var sentMessage = message.content.toString().toLowerCase();
      for (b = 0; b < badWords.length; b++) {
        if (sentMessage.includes(badWords[b])) {
          message.delete();
          message.reply("the message you just sent contained a banned word on this server!");
          if (!message.guild.channels.filter(c => c.name === settings.modLogChannel).first()) {
            return
          } else {
            const wordEmbed = new Discord.RichEmbed()
              .setAuthor("M8 Bot Moderation")
              .addField("Warned User", `${message.author} (${message.author.tag})`)
              .addField("Message", sentMessage)
              .addField("Reason", "Sent a banned word.")
              .setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
              .setThumbnail(message.author.avatarURL)
              .setTimestamp()
              .setColor(0x9900FF);
            message.guild.channels.filter(c => c.name === settings.modLogChannel).first().send({
              embed: wordEmbed
            }).catch(err => console.log(err));
            return;
          }

        }
      }
    }
  }

  // if (message.content = "pie") {
  //   message.reply(`my prefix is ${settings.prefix}`)
  //   return
  // }

  // Also good practice to ignore any message that does not start with our prefix,
  // which is set in the configuration file.

  const mentionPrefix = new RegExp(`^<@!?${client.user.id}> `);
  const prefixMention = mentionPrefix.exec(message.content);

  const prefixes = [settings.prefix, `${prefixMention}`];
  let prefix = false;

  for (const thisPrefix of prefixes) {
    if (message.content.toLowerCase().indexOf(thisPrefix) == 0) prefix = thisPrefix;
  }

  if (message.content.match(new RegExp(`^<@!?${client.user.id}>$`))) {
    return message.channel.send(`The prefix for this server is \`${settings.prefix}\`.`);
  }

  //if (message.content.indexOf(settings.prefix) !== 0) return;
  if (!prefix) return;

  // Here we separate our "command" name, and our "arguments" for the command.
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Get the user or member's permission level from the elevation
  const level = client.permlevel(message);

  // Check whether the command, or alias, exist in the collections defined
  // in app.js.
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  // using this const varName = thing OR otherthign; is a pretty efficient
  // and clean way to grab one of 2 values!
  if (!cmd) return;

  // Some commands may not be useable in DMs. This check prevents those commands from running
  // and return a friendly error message.
  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (settings.systemNotice === "true") {
      return message.channel.send(`You do not have permission to use this command.
  Your permission level is ${level} (${client.config.permLevels.find(l => l.level === level).name})
  This command requires level ${client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
    } else {
      return;
    }
  }

  // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
  // The "level" command module argument will be deprecated in the future.
  message.author.permLevel = level;

  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  // If the command exists, **AND** the user has permission, run it.
  client.logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
  cmd.run(client, message, args, level);
};
