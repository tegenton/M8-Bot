exports.run = (client, message) => {
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

  const args = message.content.split(" ").slice(1); //divide the message into args
  const streamer = args[0]; //arg 0 is the streamer's name
  var chatID = message.channel.id; //gets the chat ID that they added the streamer to
  var owner = message.guild.ownerID; //gets the server owner's id
  if (!fs.existsSync(userDir + "/" + streamer + ".txt")) { //if they are not in our database yet
    message.reply(streamer + " was not removed from this chat channel, as you never added them!");
  }
  if (fs.existsSync(userDir + "/" + streamer + ".txt")) { //if they are already in our database
    var currentServers = fs.readFileSync(userDir + "/" + streamer + ".txt", "utf-8"); //get the current allowed servers from their file
    var registered = currentServers.includes(chatID); //checks if the server they are being added to already has them
    if (registered === true) { //if they are already registered on the server
      if (currentServers == "301435504761765889, " + chatID) {
        fs.unlinkSync(userDir + "/" + streamer + ".txt");
        var streamersRaw = fs.readFileSync(rootDir + "./mixer.txt", "utf-8");
        var newStreamers = streamersRaw.replace(streamer, "");
        message.reply("you have removed " + streamer + " from the server!");
        return;
      } else {
        if (currentServers.includes(", " + chatID)) {
          var newChatList = currentServers.replace(", " + chatID, "");
        }
        fs.writeFile(userDir + "/" + streamer + ".txt", newChatList);
        message.reply("you have removed " + streamer + " from the chat channel!");
        return;
      }
    }
  }



};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["delstreamermixer", "remove-streamer-mixer", "dms", "delmixer"],
  permLevel: "Administrator"
};

exports.help = {
  name: "del-streamer-mixer",
  description: "Used to remove a Mixer streamer from that chat. Must be done by server owner or admin.",
  usage: "del-streamer-mixer ___"
};