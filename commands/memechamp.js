var fs = require("fs")
exports.run = (client, message) => {
  if (message.guild.id="250354580926365697"){
    message.delete();
  //  var list = fs.readFileSync("/champs.txt")
    message.channel.send("**All Meme Champs**\n1. @Shamepik#4479\n2. @UncleTommy#7630\n3. @Gam3rPr0#1222\n4. @Wintax#4895\n5. @UncleTommy#7630\n6. @IronTaters#1038 ")
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
