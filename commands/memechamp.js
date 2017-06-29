var fs = require("fs")
exports.run = (client, message) => {
  if (message.guild.id="250354580926365697"){
    message.delete();
    var list = fs.readFileSync("../champs.txt")
    message.channel.send (list)
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['champs'],
  permLevel: 0
};

exports.help = {
  name: 'memechamps',
  description: 'Lists all the Meme Champs',
  usage: '!memechamp'
};
