const Discord = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const settings = client.settings.get(message.guild.id);
  const person = message.content.replace(settings.prefix, "").split(" ").slice(1)
  //message.reply(person[0])
  if (message.mentions.members.size == 0 && person[0].isNumber != false) return message.reply("you must provide a mention in order to use this command.");
  const user = message.mentions.members.first();
  if (user === message.member) return message.reply("you're a few fries short of a Happy Meal. You cant warn yourself.");
  if (user === message.guild.owner) return message.reply("you can't warn the server owner bruh...");

  //message.reply(user.user.avatarURL)
  const warnEmbed = new Discord.RichEmbed()
    .setAuthor("M8 Bot Moderation")
    .addField("Warned User", `${user} (${user.user.tag})`)
    .addField("Moderator", `${message.author} (${message.member.user.tag})`)
    .addField("Reason", args.join(" ").split(person[0] + " ")[1])
    .setFooter("Sent via M8 Bot", "https://m8bot.js.org/img/profile.png")
    .setThumbnail(user.user.avatarURL)
    .setColor(0x9900FF);

  message.channel.send({
    embed: warnEmbed
  });

  message.guild.channels.filter(c => c.name === settings.modLogChannel).first().send({
    embed: warnEmbed
  }).catch(err => console.log(err));


};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "warn",
  description: "Warns a member",
  usage: "warn NAME"
};
