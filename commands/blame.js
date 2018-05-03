exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  if (message.mentions.members.size >= 1) {
    var target = message.mentions.members.first().user
  } else {
    return message.reply(`you must specify a person to blame.`)
  }

  if (target.id == message.author.id) {
    return message.channel.send(`Bakka! You can not blame yourself!`)
  }
  if (target.bot == true) {
    return message.channel.send(`Don't blame a bot! Its 100% the Dev's fault!`)
  }

  const userInfo = await client.getUserInfo(target.id);
  if (!userInfo.blames) {
    var blames = 0
    userInfo.blames = 1

  } else {
    var blames = parseInt(userInfo.blames)
    userInfo.blames = blames + 1;
  }

  client.userInfo.get(message.author.id).update({ "userInfo": userInfo }).run();

  message.channel.send(`${target.username} really screwed up! Infact, they screwed up **${blames + 1}** times!`)

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "blame",
  category: "Msc",
  description: "",
  usage: ""
};