exports.run = (client, message) => {
  const Discord = require('discord.js');
  var fs = require("fs");
  // const Carina = require('carina').Carina;
  const ws = require('ws');



  var userDir = __dirname.replace("commands", "users_twitch")
  var rootDir = __dirname.replace("commands", "")
  var timeDir = __dirname.replace("commands", "user_time_twitch")
  const settings = require(rootDir + './settings.json');
  const chalk = require('chalk');


  message.delete();
  //if an owner adds a streamer
  let args = message.content.split(" ").slice(1); //divide the message into args
  let streamer = args[0].toLowerCase(); //arg 1 is the streamer's name
  var chatID = message.channel.id; //gets the chat ID that they added the streamer to
  var owner = message.guild.ownerID; //gets the server owner's id
  if (owner == message.author.id || message.author.id == "145367010489008128" || message.author.id == "161556067954720768" || message.member.hasPermission("ADMINISTRATOR")) { //if the person who added the streamer is the owner or ComixsYT or an admin
    if (fs.existsSync(userDir + "/" + streamer + ".txt")) { //if they are already in our database
      var currentServers = fs.readFileSync(userDir + "/" + streamer + ".txt", "utf-8"); //get the current allowed servers from their file
      var registered = currentServers.includes(chatID); //checks if the server they are being added to already has them
      if (registered === true) { //if they are already registered on the server
        message.reply("the streamer " + streamer + " is already registered!"); //tell the server owner they are alreayd on
      }
      if (registered === false && !currentServers.includes(chatID)) { //if they arent on the server alreayd
        fs.writeFile(userDir + "/" + streamer + ".txt", currentServers + ", " + chatID); //adds the new server ID to their list
        message.reply("you have added the streamer " + streamer + " to your server!"); //tells the server owner that the streamer was added
      }
    }
    if (!fs.existsSync(userDir + "/" + streamer + ".txt")) { //if they are not in our database yet
      fs.writeFile(userDir + "/" + streamer + ".txt", "301435504761765889, " + chatID); //makes a new file with the chat ID
      message.reply("you have added the streamer " + streamer + " to your server!"); //tells the server owner that the streamer was added
      var currentStreamers = fs.readFileSync(rootDir + "./streamersTwitch.txt", "utf-8"); //gets the current total streamer list
      fs.writeFile(rootDir + "./streamersTwitch.txt", currentStreamers + ", " + streamer); //updates the total list with the new streamer added
      var halfHour = 1800000; //time in milis that is 30min
      var addedTime = (new Date).getTime(); //get the time the bot added the streamer
      var halfHourAgo = addedTime - 1800000; //get the time 30min before the boot
      fs.writeFile(timeDir + "/" + streamer + "_time.txt", halfHourAgo);
      var request = require("request"); //the var to request details on the streamer

      console.log(chalk.rgb(148, 0, 211)("Now stalking " + streamer + " on Twitch!"))

      function twitchCheck() {
        console.log("Checking Twitch!")
        var liveTime = (new Date).getTime();
        var lastLiveTime = fs.readFileSync("./user_time_twitch/" + streamer + "_time.txt", "utf-8");
        var timeDiff = liveTime - lastLiveTime;
        if (timeDiff >= halfHour) { //if its been 30min or more
          var request = require("request"); //the var to request details on the streamer
          request("https://api.twitch.tv/kraken/streams/" + streamer + "?client_id=" + settings.twitch_id, function(error, response, body) {
            if (!error && response.statusCode == 200) { //if there is no error
              var twitchInfo = JSON.parse(body);
              if (twitchInfo.stream == null) {
                //console.log(twitchInfo._links.self.replace("https://api.twitch.tv/kraken/streams/", "") + " is not live!")
                //console.log(twitchInfo)
              } else {


                var liveTime = (new Date).getTime();
                if (liveTime - streamStartMS < 1800000) {
                  console.log(chalk.rgb(148, 0, 211)(twitchInfo.stream.channel.name + " went live on Twitch, as its been more than 30min!"));
                  fs.writeFile("./user_time_twitch/" + twitchInfo.stream.channel.name + "_time.txt", liveTime); //update last live time
                  const hook = new Discord.WebhookClient(settings.liveID, settings.hookToken); //sets info about a webhook
                  hook.sendMessage("!live-twitch " + twitchInfo.stream.channel.name);
                  //console.log(twitchInfo)
                }

              }
            }
          });
        }
        if (timeDiff < halfHour) { //if its been less than 30min
        }

      }
      const delay = require('delay');
      delay(60000).then(() => {
        twitchCheck()
      })

      setInterval(twitchCheck, 120000); //run the check every 2min


    }

  } else { //if the person who added the streamer is not the server owner
    message.reply("You do not own this server; please do not try to add a streamer!"); //tell them they cant add a streamer
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['addstreamertwitch'],
  permLevel: 0
};

exports.help = {
  name: 'add-streamer-twitch',
  description: 'Used to add a Twitch streamer to that chat. Must be done by server owner or admin.',
  usage: 'add-streamer-twitch  ___'
};
