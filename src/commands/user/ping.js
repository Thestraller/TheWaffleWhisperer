const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Get the latency"),
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
      ephemeral: true,
    });

    const newMessage = `\`\`\`API Latency: ${client.ws.ping}ms\nClient Ping: ${
      message.createdTimestamp - interaction.createdTimestamp
    }ms\`\`\``;
    await interaction.editReply({
      content: newMessage,
    });
  },
};
