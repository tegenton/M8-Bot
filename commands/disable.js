const fs = require("fs");
var rootDir = __dirname.replace("commands", "");


exports.run = async (client, message, level) => { // eslint-disable-line no-unused-vars
  const args = message.content.split(" ").slice(1); //divide the message into args
  const id = args[0]; //arg 0 is the id

  var disabledPPL = fs.readFileSync("./disabledPPL.txt", "utf-8").split(", ");
  fs.writeFile(rootDir + "/disabledPPL.txt", disabledPPL + ", " + id); //updates the total list with the new streamer added

  message.reply(`You have disabled ${id}!`)



};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Support"
};

exports.help = {
  name: "disable",
  category: "",
  description: "",
  usage: ""
};