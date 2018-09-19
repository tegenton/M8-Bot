  const fs = require("fs");
  var rootDir = __dirname.replace("commands", "");

  exports.run = async (client, message, level) => { // eslint-disable-line no-unused-vars

    const args = message.content.split(" ").slice(1); //divide the message into args
    const plat = args[0]; //arg 0 is the platform
    const name = args[1]; //arg 1 is the name

    if (plat.toLowerCase() == "mixer") {
      if (!fs.existsSync(rootDir + "/mixer_time/" + name + "_time.txt")) {
        return message.reply(`Could not find ${name} for ${plat}.`)
      } else {
        fs.writeFile(rootDir + "/mixer_time/" + name + "_time.txt", "0")
      }
    }

    if (plat.toLowerCase() == "twitch") {
      if (!fs.existsSync(rootDir + "/twitch_time/" + name + "_time.txt")) {
        return message.reply(`Could not find ${name} for ${plat}.`)
      } else {
        fs.writeFile(rootDir + "/twitch_time/" + name + "_time.txt", "0")
      }

    } else {
      return message.reply(`Please supply a proper platform.`)
    }


  };

  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "Bot Support"
  };

  exports.help = {
    name: "reset",
    category: "",
    description: "",
    usage: ""
  };