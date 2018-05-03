exports.run = async (client, message) => {
  var fs = require("fs");

  var userDir = __dirname.replace("commands", "twitch");
  var rootDir = __dirname.replace("commands", "");
  var timeDir = __dirname.replace("commands", "twitch_time");
  message.delete();

  const args = message.content.split(" ").slice(1); //divide the message into args
  const streamer = args[0]; //arg 0 is the streamer's name
  var chatID = message.channel.id; //gets the chat ID that they added the streamer to
  var owner = message.guild.ownerID; //gets the server owner's id
  if (!fs.existsSync(userDir + "/" + streamer + ".txt")) { //if they are not in our database yet
    message.reply(streamer + " was not removed from your server, as you never added them!");
  }
  if (fs.existsSync(userDir + "/" + streamer + ".txt")) { //if they are already in our database
    var currentServers = fs.readFileSync(userDir + "/" + streamer + ".txt", "utf-8"); //get the current allowed servers from their file
    var registered = currentServers.includes(chatID); //checks if the server they are being added to already has them
    if (registered === true) { //if they are already registered on the server
      if (currentServers == "301435504761765889, " + chatID) {
        fs.unlinkSync(userDir + "/" + streamer + ".txt");
        var streamersRaw = fs.readFileSync(rootDir + "./twitchStreamers.txt", "utf-8");
        var newStreamers = streamersRaw.replace(streamer, "");
        message.reply("you have removed " + streamer + " from the server!");

      } else {
        // if (currentServers.includes(chatID + ", ") && !currentServers.includes(", " + chatID)){
        //   var newChatList = currentServers.replace(chatID + ", ", "")
        // }
        if (currentServers.includes(", " + chatID)) {
          var newChatList = currentServers.replace(", " + chatID, "");
        }
        fs.writeFile(userDir + "/" + streamer + ".txt", newChatList);
        message.reply("you have removed " + streamer + " from the server!");
      }
    }
  }



};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["delstreamertwitch", "remove-streamer-twitch", "deltwitch"],
  permLevel: "Administrator"
};

exports.help = {
  name: "del-streamer-twitch",
  description: "Used to remove a Twitch streamer from that chat. Must be done by server owner or admin.",
  usage: "del-streamer-twitch ___"
};
