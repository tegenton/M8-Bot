var version = "8.0.1";
module.exports.version = version;

// This will check if the node version you are running is the required
// Node version, if it isn't it will throw the following error to inform
// you.
if (process.version.slice(1).split(".")[0] < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

// Load up the discord.js library
const Discord = require("discord.js");
require('discord.js-aliases');
// We also load the rest of the things we need in this file:
const {
  promisify
} = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`,
// or `bot.something`, this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config file that contains our token and our prefix values.
client.config = require("./config.js");
var settings = require("./config.js");
// client.config.token contains the bot's token
// client.config.prefix contains the message prefix

// Require our logger
client.logger = require("./util/Logger");

// Let's start by getting some useful functions that we'll use throughout
// the bot, like logs and elevation features.
require("./modules/functions.js")(client);

// Aliases and commands are put in collections where they can be read from,
// catalogued, listed, etc.
client.commands = new Enmap();
client.aliases = new Enmap();

// Now we integrate the use of Evie's awesome Enhanced Map module, which
// essentially saves a collection to disk. This is great for per-server configs,
// and makes things extremely easy for this purpose.
client.settings = new Enmap({
  provider: new EnmapLevel({
    name: "settings"
  })
});

// We're doing real fancy node 8 async/await stuff here, and to do that
// we need to wrap stuff in an anonymous function. It's annoying but it works.

const init = async () => {

  // Here we load **commands** into memory, as a collection, so they're accessible
  // here and everywhere else.
  const cmdFiles = await readdir("./commands/");
  client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    if (!f.endsWith(".js")) return;
    const response = client.loadCommand(f);
    if (response) console.log(response);
  });

  // Then we load events, which will include our message and ready event.
  const evtFiles = await readdir("./events/");
  client.logger.log(`Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    // This line is awesome by the way. Just sayin'.
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  // Generate a cache of client permissions for pretty perms
  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  client.on("ready", () => {
    client.user.setActivity(`v${version} | m8bot.js.org`);
    //client.user.setGame(`Version ${version}`)

  });

  // Here we login the client.
  client.login(client.config.token);

  // End top-level async/await function.
};

init();

const fs = require("fs");
const streamerFolderMixer = "./users";
const streamerFolderTwitch = "./users_twitch";

function loadStreamers() {

  fs.readdir(streamerFolderMixer, (err, files) => {
    files.forEach(file => {
      var files = file;
    });
    var fileCount = files.length;
    //var myStreamersMixer = "Current **Mixer** Streamer List:\n"
    var allMixer = "";
    for (i = 0; i < fileCount; i++) {
      var name = files[i].replace(".txt", ", ");
      var allMixer = allMixer + name;
    }
    //console.log(allMixer)
    fs.writeFile("./streamers.txt", allMixer.replace(".DS_Store", ""));
  });

  fs.readdir(streamerFolderTwitch, (err, files) => {
    files.forEach(file => {
      var files = file;
    });
    var fileCount = files.length;
    var allTwitch = "";
    for (i = 0; i < fileCount; i++) {
      var name = files[i].replace(".txt", ", ");
      var allTwitch = allTwitch + name;
    }
    //console.log(allMixer)
    fs.writeFile("./streamersTwitch.txt", allTwitch.replace(".DS_Store", ""));
  });
}


const Carina = require("carina").Carina;
const ws = require("ws");
const chalk = require("chalk");

Carina.WebSocket = ws;
const ca = new Carina({
  isBot: true
}).open();

loadStreamers();
var halfHour = 1800000; //time in milis that is 30min

//Start Mixer -----------------------------------------------------------------------------------------
var streamers = fs.readFileSync("./streamers.txt", "utf-8").split(", ");
var streamerCount = streamers.length;

function mixerCheck() {
  for (i = 0; i < streamerCount; i++) { //Run for the # of streamers
    var halfHour = 1800000; //time in milis that is 30min
    var bootTime = (new Date).getTime(); //get the time the bot booted up
    var halfHourAgo = bootTime - 1800000; //get the time 30min before the boot
    // fs.writeFile("./user_time/" + streamers[i] + "_time.txt", halfHourAgo); //write a file with
    var request = require("request"); //the var to request details on the streamer
    request("https://mixer.com/api/v1/channels/" + streamers[i], function(error, response, body) { //ste info for the streamer in JSON
      if (!error && response.statusCode == 200) { //if there is no error checking
        var mixerInfo = JSON.parse(body); //setting a var for the JSON info
        const mixerID = mixerInfo.id; //getting the ID of the streamer
        console.log(chalk.cyan("Now stalking " + mixerInfo.token + " on mixer!")); //logs that the bot is watching for the streamer to go live
        ca.subscribe(`channel:${mixerID}:update`, data => { //subscribing to the streamer
          var mixerStatus = data.online; //checks if they are online (its a double check just incase the above line miss fires)
          if (mixerStatus == true) { //if the bam info JSON says they are live
            var liveTime = (new Date).getTime(); //time the bot sees they went live
            var lastLiveTime = fs.readFileSync("./user_time/" + mixerInfo.token + "_time.txt", "utf-8"); //checks the last live time
            var timeDiff = liveTime - lastLiveTime; //gets the diff of current and last live times
            //console.log(timeDiff);
            if (timeDiff >= halfHour) { //if its been 30min or more
              console.log(chalk.cyan(mixerInfo.token + " went live, as its been more than 30min!")); //log that they went live
              const hook = new Discord.WebhookClient(settings.liveID, settings.hookToken); //sets info about a webhook
              hook.sendMessage("!live " + mixerInfo.token); //tells the webhook to send a message to a private channel that M8Bot is listening to




            }
            if (timeDiff < halfHour) { //if its been less than 30min
              console.log(mixerInfo.token + " attempted to go live, but its been under 30min!"); //log that its been under 30min
            }
            fs.writeFile("./user_time/" + mixerInfo.token + "_time.txt", liveTime); //update last live time regardless if they went live or not
          }
        });
      }
    });
  }
}
const delay = require("delay");
delay(30000).then(() => {
  mixerCheck();
});
//End Mixer ------------------------------------------------------------------------------------------



//Start Twitch
var streamersTwitch = fs.readFileSync("./streamersTwitch.txt", "utf-8").split(", ");
var streamerCountTwitch = streamersTwitch.length;

for (t = 0; t < streamerCountTwitch; t++) {
  var bootTime = (new Date).getTime(); //get the time the bot booted up
  var halfHourAgo = bootTime - 1800000; //get the time 30min before the boot
  // fs.writeFile("./user_time_twitch/" + streamersTwitch[t] + "_time.txt", halfHourAgo);
  console.log(chalk.magenta("Now stalking " + streamersTwitch[t] + " on Twitch!"));
}

function twitchCheck() {
  console.log(chalk.magenta("Checking Twitch!"));
  for (tc = 0; tc < streamersTwitch.length; tc++) {
    var liveTime = (new Date).getTime();
    var lastLiveTime = fs.readFileSync("./user_time_twitch/" + streamersTwitch[tc] + "_time.txt", "utf-8");
    var timeDiff = liveTime - lastLiveTime;
    if (timeDiff >= halfHour) { //if its been 30min or more
      var request = require("request"); //the var to request details on the streamer
      request("https://api.twitch.tv/kraken/streams/" + streamersTwitch[tc] + "?client_id=" + settings.twitch_id, function(error, response, body) {
        if (!error && response.statusCode == 200) { //if there is no error
          var twitchInfo = JSON.parse(body);
          if (twitchInfo.stream == null) {
            //console.log(twitchInfo._links.self.replace("https://api.twitch.tv/kraken/streams/", "") + " is not live!")
            //console.log(twitchInfo)
          } else {
            var liveTime = (new Date).getTime();
            var streamStartTime = new Date(twitchInfo.stream.created_at);
            var streamStartMS = streamStartTime.getTime();
            if (liveTime - streamStartMS < 1800000) {
              console.log(chalk.magenta(twitchInfo.stream.channel.name + " went live on Twitch, as its been more than 30min!"));
              fs.writeFile("./user_time_twitch/" + twitchInfo.stream.channel.name + "_time.txt", liveTime); //update last live time
              const hook = new Discord.WebhookClient(settings.liveID, settings.hookToken); //sets info about a webhook
              hook.sendMessage("!live-twitch " + twitchInfo.stream.channel.name);
              //console.log(twitchInfo)
            }
          }
        }
      });
    }
  }
}

delay(60000).then(() => {
  twitchCheck();
});

setInterval(twitchCheck, 120000); //run the check every 2min

//End Twitch
