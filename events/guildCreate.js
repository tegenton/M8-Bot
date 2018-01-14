// This event executes when a new guild (server) is joined.
const Discord = require("discord.js");

var rootDir = __dirname.replace("events", "");
const settings = require(rootDir + "./config.js");

module.exports = (client, guild) => {
  // We need to add this guild to our settings!
  client.settings.set(guild.id, client.config.defaultSettings);
  const fetch = require("snekfetch");

  console.log("I just joined a new server called " + guild.name);
  new fetch("POST", `https://discordbots.org/api/bots/${client.user.id}/stats`)
    .set("Authorization", settings.discordbots_org)
    .send({
      server_count: client.guilds.size
    })
    .then(() => console.log("Updated dbots.org status.")).catch((e) => e);
  guild.channels.first().send("Hey guys and gals! I'm M8 Bot! Its great to meet you all, and I hope you enjoy me :P\nA list of my commands can be found by using \"!help m8bot\".\nIf you encounter any issues, you can type \"!m8bug\" to recive links to submit issues!\nAdditionaly, you can learn how to change settings & add streamers by visiting https://m8bot.js.org/#Setup.");

  const joinedEmbed = new Discord.RichEmbed()
    .setColor(0x00FF00)
    .setTitle("Joined " + guild.name)
    .setFooter("Sent via M8 Bot", settings.botLogo)
    .setTimestamp()
    .setThumbnail(guild.iconURL)
    .addField("Members", guild.memberCount, true)
    .addField("Owner", guild.owner, true);
  client.channels.get("352990232624496641").sendEmbed(joinedEmbed);


};
