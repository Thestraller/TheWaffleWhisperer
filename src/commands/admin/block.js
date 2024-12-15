const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const CryptoJS = require("crypto-js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("block")
    .setDescription("Block a user from whispering")
    .addStringOption((option) =>
      option
        .setName("user-id")
        .setDescription("ID of the member, can be either encrypted or not")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    let userid = interaction.options.getString("user-id");
    var user;
    var userEncrypted;
    if (userid.split("").length > 18) {
      user = CryptoJS.AES.decrypt(userid, process.env.key).toString(
        CryptoJS.enc.Utf8
      );
      userEncrypted = userid;
    } else {
      user = userid;
      userEncrypted = String(CryptoJS.AES.encrypt(userid, process.env.key));
    }

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

      if (user === userid) {
        var encrypted = false;
      } else var encrypted = true;

      client.channels.cache.get(process.env.logChannelID).send({
        content: `# <@!${process.env.board0ID}> <@!${process.env.board1ID}> <@!${process.env.board2ID}> there was an unauthorized attempt to block someone!\n\n**User:** \`${interaction.member.user.username}\`\n**User ID:** \`${interaction.member.id}\`\n\n**Server:** \`${interaction.guild.name}\`\n**Server ID:** \`${interaction.guild.id}\`\n\n**Block ID:** \`${user}\`\n**Encrypted:** \`${encrypted}\``,
      });
      return;
    }

    const blockedUsers = fs
      .readFileSync("./blocked.txt", "utf-8")
      .split(/\r?\n/);
    for (const blockedUser of blockedUsers) {
      if (
        CryptoJS.AES.decrypt(blockedUser, process.env.key).toString(
          CryptoJS.enc.Utf8
        ) == user
      ) {
        interaction.reply({
          content: "User is blocked",
          ephemeral: false,
        });
        client.channels.cache.get(process.env.logChannelID).send({
          content: `# <@!${interaction.member.id}> blocked a user with the following (encrypted) ID:\n||\`${userid}\`||`,
        });
        return;
      }
    }

    fs.appendFile("./blocked.txt", userEncrypted + "\n", function (err) {
      if (err) {
        console.error(error);
        interaction.reply({
          content:
            "Uh oh, something went wrong! If you think this is a bug, please report it using the `/bug` command, or join the Craftworld support server: https://discord.gg/MzRGg8ct3A",
          ephemeral: true,
        });
        client.channels.cache.get(process.env.serverChannelID).send({
          content: error,
        });
      }
    });
    await interaction.reply({
      content: "User is blocked",
      ephemeral: false,
    });
    client.channels.cache.get(process.env.logChannelID).send({
      content: `# <@!${interaction.member.id}> blocked a user with the following (encrypted) ID:\n||\`${userid}\`||`,
    });
  },
};
