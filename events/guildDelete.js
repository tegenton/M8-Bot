// This event executes when a new guild (server) is left.
const Discord = require("discord.js");

var rootDir = __dirname.replace("events", "");
const settings = require(rootDir + "./config.js");

module.exports = async (client, guild) => {
  // Well they're gone. Let's remove them from the settings!
  await client.settings.get(guild.id).delete().run();

  // const fetch = require("snekfetch");

  // // discordbots_org
  // new fetch("POST", `https://discordbots.org/api/bots/${client.user.id}/stats`)
  //   .set("Authorization", settings.discordbots_org)
  //   .send({
  //     server_count: client.guilds.size
  //   })
  //   .then(() => console.log("Updated dbots.org status.")).catch((e) => e);

  const fetch = require('snekfetch')
  const dbotstoken = settings.discordbots_org

  client.shard.fetchClientValues('guilds.size').then(result => {
    const guildsizes = result.reduce((prev, val) => prev + val, 0)
    fetch.post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
      .set('Authorization', settings.discordbots_org)
      .send({ "server_count": guildsizes })
      .then(() => console.log(`dbotsstats updated successfully`))
      .catch(err => console.error(err))
  })

  // bots.discord.pw
  new fetch("POST", `https://bots.discord.pw/api/bots/${client.user.id}/stats`)
    .set("Authorization", settings.discordbot_pw)
    .send({
      server_count: client.guilds.size
    }).then(() => console.log("Updated bots.discord.pw status.")).catch((e) => e);
  const leftEmbed = new Discord.RichEmbed()
    .setColor(0xFF0000)
    .setTitle("Left " + guild.name)
    .setFooter("Sent via M8 Bot", settings.botLogo)
    .setTimestamp()
    .setThumbnail(guild.iconURL)
    .addField("Members", guild.memberCount, true)
    .addField("Owner", guild.owner, true);
  client.channels.get("352990232624496641").sendEmbed(leftEmbed);
  
};
