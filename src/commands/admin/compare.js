const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const CryptoJS = require("crypto-js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("compare")
    .setDescription("Compare two encrypted user IDs to see if they are the same user")
    .addStringOption((option) =>
      option
        .setName("user-id-1")
        .setDescription("ID of the first member")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("user-id-2")
        .setDescription("ID of the second member")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    let userid1 = interaction.options.getString("user-id-1");
    let userid2 = interaction.options.getString("user-id-2");

    const admins = [
      process.env.board0ID,
      process.env.board1ID,
      process.env.board2ID,
    ];
    if (!admins.includes(interaction.member.id)) {
      await interaction.reply({
        content: "Only Board Members of Wafcorp can use that command!",
        ephemeral: true,
      });

      client.channels.cache.get(process.env.logChannelID).send({
        content: `# <@!${process.env.board0ID}> <@!${process.env.board1ID}> <@!${process.env.board2ID}> there was an unauthorized attempt to compare 2 IDs!\n\n**User:** \`${interaction.member.user.username}\`\n**User ID:** \`${interaction.member.id}\`\n\n**Server:** \`${interaction.guild.name}\`\n**Server ID:** \`${interaction.guild.id}\``,
      });

      return;
    }

    const user1 = CryptoJS.AES.decrypt(userid1, process.env.key).toString(
      CryptoJS.enc.Utf8
    );
    const user2 = CryptoJS.AES.decrypt(userid2, process.env.key).toString(
      CryptoJS.enc.Utf8
    );

    if (user1 == user2){
    await interaction.reply({
      content: "These two IDs belong to the same user",
      ephemeral: false,
    });
  } else {
    await interaction.reply({
      content: "These two IDs do **not** belong to the same user",
      ephemeral: false,
    });
  }
  },
};
