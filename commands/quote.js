exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  const Discord = require("discord.js");


  function quote(messageInfo) {
    var text = messageInfo.content
    var author = messageInfo.author
    var tag = author.tag
    var icon = author.displayAvatarURL
    var time = new Date(messageInfo.createdTimestamp);

    const quoteEmbed = new Discord.RichEmbed()
      .setColor(0x9900FF)
      .setThumbnail(icon)
      .setTimestamp()
      .setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
      .setAuthor(tag)
      .setDescription(`${time}\n\n${text}`)

    return message.channel.send({
      embed: quoteEmbed
    });

  }

  if (args.length == 1) {
    try {
      message.channel.fetchMessage(args[0])
        .then(message => quote(message))
      // .catch(message.reply("there was an error finding that message. Please make sure you have the proper message ID."));
    } catch (error) {
      console.log(error)
      // return message.reply("there was an error finding that message. Please make sure you have the proper message ID.")
    }
  }

  if (args.length == 2) {
    try {
      client.channels.get(args[1]).fetchMessage(args[0])
        .then(message => quote(message))
      // .catch(message.reply("there was an error finding that message. Please make sure you have the proper message ID."));

    } catch (error) {
      console.log(error)
      return message.reply("there was an error finding that message. Please make sure you have the proper message ID.")
    }

  }

  if (args.length == 0) {
    return message.reply("you must supply a message ID (and a channel ID if the message is in another channel).")
  }

  if (args.length >= 3) {
    return message.reply("you must only supply a message ID (and a channel ID if the message is in another channel).")
  }

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "quote",
  category: "Misc",
  description: "Used to quote people",
  usage: "quite [messageID][channelID]"
};