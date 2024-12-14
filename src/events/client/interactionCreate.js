const { InteractionType } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content:
            "Something went wrong! If this problem occurs more often, please report it to [DrThestral](<https://discord.com/users/509752937388703744>)!",
          ephemeral: true,
        });
      }
    } else if (interaction.type == InteractionType.ModalSubmit) {
      const { modals } = client;
      const { customId } = interaction;
      const modal = modals.get(customId);
      if (!modal) return new Error("This modal does not exist.");

      try {
        await modal.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content:
            "Something went wrong! If this problem occurs more often, please report it to [DrThestral](<https://discord.com/users/509752937388703744>)!",
          ephemeral: true,
        });
      }
    }
  },
};
