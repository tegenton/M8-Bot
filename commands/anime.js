var Anime = require('malapi').Anime;
const Discord = require("discord.js");


exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const settings = client.settings.get(message.guild.id);
  //message.reply(args)
  Anime.fromName(args).then(anime => {
    //console.log(anime.title);
    const animeEmbed = new Discord.RichEmbed()
    //.setAuthor(anime.title, "", anime.detailsLink)
    .setTitle(anime.title)
    .addField("Status", anime.status, true)
    .addField("Total Episodes", anime.episodes, true)
    .addField("Aired", anime.aired, true)
    .addField("Score", anime.statistics.score.value + "/10", true)
    .addField("Rating", anime.classification, true)
    .addField("Type", anime.type, true)
    .addField("Genres", anime.genres.toString())
    .setURL(anime.detailsLink)
    //.toString().replace("[ ", "").replace("'", "").replace(" ]", "").replace(",", "")
    .setDescription(anime.synopsis)
    .setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
    .setThumbnail(anime.image)
    .setColor(0x9900FF)

    message.channel.send({
      embed: animeEmbed
    })
  });
//  message.channel.send(Anime.fromName)

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["weebshow"],
  permLevel: "User"
};

exports.help = {
  name: "anime",
  description: "finds anime",
  usage: "anime dragon ball super"
};
