exports.run = (client, message) => {
  message.delete();
  message.channel.send("┻━┻彡ヽ(ಠДಠ)ノ彡┻━┻﻿")
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['doubleflip'],
  permLevel: 0
};

exports.help = {
  name: 'doubletableflip',
  description: '┻━┻彡ヽ(ಠДಠ)ノ彡┻━┻﻿',
  usage: 'lenny'
};
