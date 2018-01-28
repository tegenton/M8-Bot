const Discord = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const settings = client.settings.get(message.guild.id);
  const person = message.content.replace(settings.prefix, "").split(" ").slice(1)
  //message.reply(person[0])
  if (message.mentions.members.size == 0 && person[0].isNumber != false) return message.reply("you must provide a mention in order to use this command.");
  const user = message.mentions.members.first();
  if (user === message.member) return message.reply("don't rip out your own vocal chords m8! You cant mute yourself.");
  if (user === message.guild.owner) return message.reply("you can't mute the server owner bruh...");
  var bad = "n"
  await message.guild.members.get(user.id).addRole(settings.muteRole).catch(err => {
    return message.reply("unable to mute the user. I may not have the proper permissions to do so, or the mute role may of not ben sey up correctly. Please try again later."), bad = "y";
  });

  if (bad = "n") {
    const muteEmbed = new Discord.RichEmbed()
      .setAuthor("M8 Bot Moderation")
      .addField("Muted User", `${user} (${user.user.tag})`)
      .addField("Moderator", `${message.author} (${message.member.user.tag})`)
      .addField("Reason", args.join(" ").split(person[0] + " ")[1])
      .setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
      .setThumbnail(user.user.avatarURL)
      .setColor(0x9900FF);

    message.channel.send({
      embed: muteEmbed
    });

    message.guild.channels.filter(c => c.name === settings.modLogChannel).first().send({
      embed: muteEmbed
    }).catch(err => console.log(err));
  }
  //message.reply(user.user.avatarURL)



};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "mute",
  description: "mutes a member",
  usage: "mute NAME"
};
