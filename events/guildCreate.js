// This event executes when a new guild (server) is joined.

const Discord = require("discord.js");

var rootDir = __dirname.replace("events", "");
const settings = require(rootDir + "./config.js");

module.exports = async (client, guild) => {
  // We need to add this guild to our settings!
  await client.settings.insert({
    "id": guild.id,
    "settings": client.config.defaultSettings
  }).run();

  const fetch = require("snekfetch");
  console.log("I just joined a new server called " + guild.name);
  // discordbots.org
  new fetch("POST", `https://discordbots.org/api/bots/${client.user.id}/stats`)
    .set("Authorization", settings.discordbots_org)
    .send({
      server_count: client.guilds.size
    })
    .then(() => console.log("Updated dbots.org status.")).catch((e) => e);

  // bots.discord.pw
  new fetch("POST", `https://bots.discord.pw/api/bots/${client.user.id}/stats`)
    .set("Authorization", settings.discordbot_pw)
    .send({
      server_count: client.guilds.size
    }).then(() => console.log("Updated bots.discord.pw status.")).catch((e) => e);

  const joinedEmbed = new Discord.RichEmbed()
    .setColor(0x00FF00)
    .setTitle("Joined " + guild.name)
    .setFooter("Sent via M8 Bot", settings.botLogo)
    .setTimestamp()
    .setThumbnail(guild.iconURL)
    .addField("Members", guild.memberCount, true)
    .addField("Owner", guild.owner, true)
    .addField("Guild ID", guild.id, true)
  client.channels.get("352990232624496641").sendEmbed(joinedEmbed);
};
