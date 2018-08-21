exports.run = (client, message) => {
  const Discord = require("discord.js");
  var fs = require("fs");
  const Carina = require("carina").Carina;
  const ws = require("ws");

  Carina.WebSocket = ws;
  const ca = new Carina({
    isBot: true
  }).open();
  var userDir = __dirname.replace("commands", "mixer");
  var rootDir = __dirname.replace("commands", "");
  var timeDir = __dirname.replace("commands", "mixer_time");
  message.delete();
  //if an owner adds a streamer
  const args = message.content.split(" ").slice(1); //divide the message into args
  const streamer = args[0]; //arg 0 is the streamer's name
  var chatID = message.channel.id; //gets the chat ID that they added the streamer to
  var owner = message.guild.ownerID; //gets the server owner's id
  if (fs.existsSync(userDir + "/" + streamer + ".txt")) { //if they are already in our database
    var currentServers = fs.readFileSync(userDir + "/" + streamer + ".txt", "utf-8"); //get the current allowed servers from their file
    var registered = currentServers.includes(chatID); //checks if the server they are being added to already has them
    if (registered === true) { //if they are already registered on the server
      message.reply("the streamer " + streamer + " is already registered!"); //tell the server owner they are alreayd on
    }
    if (registered === false && !currentServers.includes(chatID)) { //if they arent on the server already
      fs.writeFile(userDir + "/" + streamer + ".txt", currentServers + ", " + chatID); //adds the new server ID to their list
      message.reply("you have added the streamer " + streamer + " to this chat channel!"); //tells the server owner that the streamer was added
    }
  }
  if (!fs.existsSync(userDir + "/" + streamer + ".txt")) { //if they are not in our database yet
    fs.writeFile(userDir + "/" + streamer + ".txt", "301435504761765889, " + chatID); //makes a new file with the chat ID
    var currentStreamers = fs.readFileSync(rootDir + "./mixerStreamers.txt", "utf-8"); //gets the current total streamer list
    fs.writeFile(rootDir + "/mixerStreamers.txt", currentStreamers + ", " + streamer); //updates the total list with the new streamer added
    var halfHour = 1800000; //time in milis that is 30min
    var addedTime = (new Date).getTime(); //get the time the bot added the streamer
    var halfHourAgo = addedTime - 1800000; //get the time 30min before they were added
    fs.writeFile(timeDir + "/" + streamer + "_time.txt", halfHourAgo); //write a file with
    message.reply("you have added the streamer " + streamer + " to your server!"); //tells the server owner that the streamer was added
    var request = require("request"); //the var to request details on the streamer
    request("https://mixer.com/api/v1/channels/" + streamer, function (error, response, body) { //ste info for the streamer in JSON
      if (!error && response.statusCode == 200) { //if there is no error checking
        var mixerInfo = JSON.parse(body); //setting a var for the JSON info
        const mixerID = mixerInfo.id; //getting the ID of the streamer
        console.log("Now stalking " + mixerInfo.token + " on mixer!"); //logs that the bot is watching for the streamer to go live
        ca.subscribe(`channel:${mixerID}:update`, data => { //subscribing to the streamer
          var mixerStatus = data.online; //checks if they are online (its a double check just incase the above line miss fires)
          if (mixerStatus == true) { //if the bam info JSON says they are live
            var liveTime = (new Date).getTime(); //time the bot sees they went live
            if (!fs.existsSync("./mixer_time/" + mixerInfo.token + "_time.txt")) {
              fs.writeFile("./mixer_time/" + mixerInfo.token + "_time.txt", "0")
            }
            var lastLiveTime = fs.readFileSync(timeDir + "/" + mixerInfo.token + "_time.txt", "utf-8"); //checks the last live time
            var timeDiff = liveTime - lastLiveTime; //gets the diff of urrent and last live times
            //console.log(timeDiff);
            if (timeDiff >= halfHour) { //if its been 30min or more
              console.log(mixerInfo.token + " went live, as its been more than 30min!"); //log that they went live
              const hook = new Discord.WebhookClient(settings.liveID, settings.hookToken); //sets info about a webhook
              hook.sendMessage(`${mixerInfo.token} went live on Mixer!`);
              client.liveMixer(mixerInfo.token)
            }
            if (timeDiff < halfHour) { //if its been less than 30min
              console.log(mixerInfo.token + " attempted to go live, but its been under 30min!"); //log that its been under 30min
            }
            fs.writeFile(timeDir + "/" + mixerInfo.token + "_time.txt", liveTime); //update last live time regardless if they went live or not
          }
        });
      }
    });
  }


};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["addstreamermixer", "asm", "addmixer"],
  permLevel: "Administrator"
};

exports.help = {
  name: "add-streamer-mixer",
  description: "Used to add a Mixer streamer to that chat. Must be done by server owner or admin.",
  usage: "add-streamer-mixer  ___"
};