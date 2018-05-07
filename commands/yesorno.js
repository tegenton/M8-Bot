exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  if (!args[0]) {
    return message.reply(`Please supply a yes or no question.`)
  }

  let msg
  msg = await message.channel.send(`<a:loading:417323455147540490> Consulting the board on ${message.author.username}'s question...`);

  const Discord = require('discord.js');

  const snek = require('snekfetch')
  const {
    body
  } = await snek.get('https://yesno.wtf/api');


  if (body.answer == "no") {
    var answer = "No"
  }
  if (body.answer == "yes") {
    var answer = "Yes"
  }
  if (body.answer == "maybe") {
    var answer = "Maybe"
  }

  const ynEmbed = new Discord.RichEmbed()
    .setImage(body.image)
    .addField("Question", args.join(" "))
    .addField("Answer", answer)
    .setFooter("Sent via M8 Bot", client.config.botLogo)
    .setTimestamp()
    .setColor(0x9900FF)


  await message.channel.send({
    embed: ynEmbed
  })


  await msg.delete();


};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['question', 'answer', 'ask'],
  permLevel: "User"
};

exports.help = {
  name: "yesorno",
  category: "Msc",
  description: "",
  usage: ""
};