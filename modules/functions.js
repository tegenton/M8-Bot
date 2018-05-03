module.exports = (client) => {

  /*
  PERMISSION LEVEL FUNCTION

  This is a very basic permission system for commands which uses "levels"
  "spaces" are intentionally left black so you can add them if you want.
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command including the VERY DANGEROUS `eval` and `exec` commands!

  */
  client.permlevel = message => {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  };


  /*
  SINGLE-LINE AWAITMESSAGE

  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...

  USAGE

  const response = await client.awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);

  */
  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m => m.author.id = msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, {
        max: 1,
        time: limit,
        errors: ["time"]
      });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };


  /*
  MESSAGE CLEAN FUNCTION

  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
  This is mostly only used by the Eval and Exec commands.
  */
  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof evaled !== "string")
      text = require("util").inspect(text, {
        depth: 0
      });

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  };

  client.loadCommand = (commandName) => {
    try {
      const props = require(`../commands/${commandName}`);
      client.log("cmd", `Loading Command: ${props.help.name}. 👌`);
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  };

  client.unloadCommand = async (commandName) => {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(client);
    }
    delete require.cache[require.resolve(`../commands/${commandName}.js`)];
    return false;
  };

  client.getSettings = async (id) => {
    let settings;
    const check = await client.settings.get(id).run();
    if (check != null) {
      settings = await client.settings.get(id).getField("settings").run();
      return settings;
    } else {
      return client.config.defaultSettings;
    }
  };

  client.getUserInfo = async (id) => {
    let userInfo;
    const check = await client.userInfo.get(id).run();
    if (check != null) {
      userInfo = await client.userInfo.get(id).getField("userInfo").run();
      return userInfo;
    } else {
      return client.config.defaultUser;
    }
  };

  client.liveMixer = async (mixer) => {
    const Discord = require("discord.js");
    require('discord.js-aliases');
    var fs = require("fs");
    var userDir = __dirname.replace("modules", "mixer");
    var rootDir = __dirname.replace("modules", "");
    var timeDir = __dirname.replace("modules", "mixer_time");

    const settings = client.config

    if (fs.existsSync(userDir + "/" + mixer + ".txt")) { //varifies that the streamer is on record
      var request = require("request"); //sets a var to request info
      request("https://mixer.com/api/v1/channels/" + mixer, function (error, response, body) { //request streamer's in in JSON form
        if (!error && response.statusCode == 200) { //if there is no error
          var mixerInfo = JSON.parse(body); //sets mixerInfo to the JSON data
          if (mixerInfo.type == null) { //if there is no game set to the stream
            var game = "[API ERROR]"; //set the game to the meme game
            const liveEmbed = new Discord.RichEmbed() //start the embed message template
              .setTitle(mixerInfo.token + "\'s Stream")
              .setAuthor(mixerInfo.name)
              .setColor(0x9900FF)
              .setDescription("Hey guys, " + mixer + " is live right now! Click above to watch!")
              .setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
              .setThumbnail(mixerInfo.user.avatarUrl)
              .setTimestamp()
              .setURL("http://mixer.com/" + mixer)
              .addField("Streaming", game, true)
              .addField("Followers", mixerInfo.numFollowers, true)
              .addField("Mixer Level", mixerInfo.user.level, true)
              .addField("Total Views", mixerInfo.viewersTotal, true);
            var serversAllowedRaw = fs.readFileSync(userDir + "/" + mixer + ".txt", "utf-8"); //get the list of servers they are allowed to ne announced on
            var serversAllowed = serversAllowedRaw.split(", "); //splits the servers into individual strings
            for (i = 0; i < serversAllowed.length; i++) { //run for the total number of servers they are allowed on

              if (client.channels.map(c => c.id).includes(serversAllowed[i])) {

                sendMixer = async (channelID) => {
                  var liveMessage = "";
                  var guildID = client.channels.get(channelID).guild.id
                  const settings = await client.getSettings(guildID);
                  if (!settings.livePing || settings.livePing == "true") {
                    console.log("liveping is on")
                    var liveMessage = liveMessage + "@here, "
                  }
                  if (!settings.liveMixerMessage) {
                    var liveMessage = liveMessage + mixer + " is now live on Mixer!"
                  } else {
                    var liveMessage = liveMessage + settings.liveMixerMessage.replace("{{streamer}}", mixer)
                  }

                  client.channels.get(channelID).sendEmbed(liveEmbed, liveMessage); //send the live message to servers
                }

                sendMixer(serversAllowed[i])

              }
            }
          } else { //if there is a game set
            var game = mixerInfo.type.name; //set the game var to the streamer's game
            // if (game = "PLAYERUNKNOWN'S BATTLEGROUNDS") {
            //   var game = "PUBG"
            // }
            const liveEmbed = new Discord.RichEmbed() //start the embed message template
              .setTitle(mixerInfo.token + "\'s Stream")
              .setAuthor(mixerInfo.name)
              .setColor(0x9900FF)
              .setDescription("Hey guys, " + mixer + " is live right now! Click above to watch!")
              .setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
              .setThumbnail(mixerInfo.user.avatarUrl)
              .setTimestamp()
              .setURL("http://mixer.com/" + mixer)
              .addField("Streaming", game, true)
              .addField("Followers", mixerInfo.numFollowers, true)
              .addField("Mixer Level", mixerInfo.user.level, true)
              .addField("Total Views", mixerInfo.viewersTotal, true)
              .setImage(mixerInfo.type.backgroundUrl); //end the embed message template
            var serversAllowedRaw = fs.readFileSync(userDir + "/" + mixer + ".txt", "utf-8"); //get the list of servers they are allowed to ne announced on
            var serversAllowed = serversAllowedRaw.split(", "); //splits the servers into individual strings
            for (i = 0; i < serversAllowed.length; i++) { //run for the total number of servers they are allowed on
              if (client.channels.map(c => c.id).includes(serversAllowed[i])) {
                sendMixer = async (channelID) => {
                  var liveMessage = "";
                  var guildID = client.channels.get(channelID).guild.id
                  const settings = await client.getSettings(guildID);
                  if (!settings.livePing || settings.livePing == "true") {
                    var liveMessage = liveMessage + "@here, "
                  }
                  if (!settings.liveMixerMessage) {
                    var liveMessage = liveMessage + mixer + " is now live on Mixer!"
                  } else {
                    var liveMessage = liveMessage + settings.liveMixerMessage.replace("{{streamer}}", mixer)
                  }

                  client.channels.get(channelID).sendEmbed(liveEmbed, liveMessage); //send the live message to servers
                }

                sendMixer(serversAllowed[i])
              }
            }



          }
        }
      });
    }
    
  }

  client.liveTwitch = async (twitch) => {
    const Discord = require("discord.js");
    require('discord.js-aliases');
    var fs = require("fs");
    var userDir = __dirname.replace("modules", "twitch");
    var rootDir = __dirname.replace("modules", "");
    var timeDir = __dirname.replace("modules", "twitch_time");
    const settings = require(rootDir + "/config.js");

    if (fs.existsSync(userDir + "/" + twitch + ".txt")) { //varifies that the streamer is on record
      var request = require("request"); //sets a var to request info
      request("https://api.twitch.tv/kraken/channels/" + twitch + "?client_id=" + settings.twitch_id, function (error, response, body) { //request streamer's in in JSON form
        if (!error && response.statusCode == 200) { //if there is no error
          var twitchInfo = JSON.parse(body); //sets twitchInfo to the JSON data
          if (twitchInfo.game == null) { //if there is no game set to the stream
            var game = "[API ERROR]"; //set the game to the meme game
          } else { //if there is a game set
            var game = twitchInfo.game; //set the game var to the streamer's game
            // if (game = "PLAYERUNKNOWN'S BATTLEGROUNDS") {
            //   var game = "PUBG"
            // }
          }
          const liveEmbed = new Discord.RichEmbed() //start the embed message template
            .setTitle(twitchInfo.display_name + "\'s Stream")
            .setAuthor(twitchInfo.status)
            .setColor(0x9900FF)
            .setDescription("Hey guys, " + twitch + " is live right now! Click above to watch!")
            .setFooter("Sent via M8 Bot", "http://m8bot.js.org/img/profile.png")
            .setThumbnail(twitchInfo.logo)
            .setTimestamp()
            .setURL("http://twitch.tv/" + twitch)
            .addField("Streaming", game)
            .addField("Followers", twitchInfo.followers, true)
            .addField("Total Views", twitchInfo.views, true); //end the embed message template
          var serversAllowedRaw = fs.readFileSync(userDir + "/" + twitch + ".txt", "utf-8"); //get the list of servers they are allowed to ne announced on
          var serversAllowed = serversAllowedRaw.split(", "); //splits the servers into individual strings
          for (i = 0; i < serversAllowed.length; i++) { //run for the total number of servers they are allowed on
            if (client.channels.map(c => c.id).includes(serversAllowed[i])) {

              sendTwitch = async (channelID) => {
                var liveMessage = "";
                var guildID = client.channels.get(channelID).guild.id
                const settings = await client.getSettings(guildID);
                // const settings = client.settings.get(guildID).getField("settings").run();
                if (!settings.livePing || settings.livePing == "true") {
                  var liveMessage = liveMessage + "@here, "
                }
                if (!settings.liveTwitchMessage) {
                  var liveMessage = liveMessage + twitchInfo.display_name + " is now live on Twitch!"
                } else {
                  var liveMessage = liveMessage + settings.liveTwitchMessage.replace("{{streamer}}", twitchInfo.display_name)
                }
                client.channels.get(channelID).sendEmbed(liveEmbed, liveMessage); //send the live message to servers
              }

              sendTwitch(serversAllowed[i])


            }
          }
        }
      });
    }
  }


  /* MISCELANEOUS NON-CRITICAL FUNCTIONS */

  // EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
  // later, this conflicts with native code. Also, if some other lib you use does
  // this, a conflict also occurs. KNOWING THIS however, the following 2 methods
  // are, we feel, very useful in code.

  // <String>.toPropercase() returns a proper-cased string such as:
  // "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
  String.prototype.toProperCase = function () {
    return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  // <Array>.random() returns a single random element from an array
  // [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
  Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
  };

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require("util").promisify(setTimeout);

  // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Uncaught Exception: ", errorMsg);
    // Always best practice to let the code crash on uncaught exceptions.
    // Because you should be catching them anyway.
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    console.error("Uncaught Promise Error: ", err);
  });
};