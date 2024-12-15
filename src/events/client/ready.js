const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`${client.user.tag} is online`);
    client.user.setPresence({ activities: [{ name: '*Insert whispering noises*', type: ActivityType.Custom }], status: 'online' });
    client.channels.cache.get(process.env.serverChannelID).send({
      content: `The Waffle Whisperer is online`,
    });
  },
};
