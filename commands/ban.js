const Discord = require("discord.js");

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const settings = client.settings.get(message.guild.id);
  const person = message.content.replace(settings.prefix, "").split(" ").slice(1)
  //message.reply(person[0])
  if (message.mentions.members.size == 0 && person[0].isNumber != false) return message.reply("you must provide a mention in order to use this command.");
  const user = message.mentions.members.first();
  if (user === message.member) return message.reply("are you sure about that? You cant ban yourself.");
  if (user === message.guild.owner) return message.reply("I have stopped you from starting a military uprising, you can't ban the server owner!");
  if (user.kickable == false) return message.reply("that member could not be banned, please make sure that the M8 Bot role is higher than the users highest role and has permission to ban users.");

  //message.reply(user.user.avatarURL)
  const banEmbed = new Discord.RichEmbed()
    .setAuthor("M8 Bot Moderation")
    .addField("Banned User", `${user} (${user.user.tag})`)
    .addField("Moderator", `${message.author} (${message.member.user.tag})`)
    .addField("Reason", args.join(" ").split(person[0] + " ")[1])
    .setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
    .setThumbnail(user.user.avatarURL)
    .setColor(0x9900FF);

  message.channel.send({
    embed: banEmbed
  });

  await message.guild.members.get(user.id).ban(message.author.tag + " banned via M8 Bot").catch(err => {
    return message.reply("unable to ban the user, please try again later."), console.log(err);
  });

  message.guild.channels.filter(c => c.name === settings.modLogChannel).first().send({
    embed: banEmbed
  }).catch(err => console.log(err));


};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Administrator"
};

exports.help = {
  name: "ban",
  description: "bans a member",
  usage: "ban NAME reason"
};
