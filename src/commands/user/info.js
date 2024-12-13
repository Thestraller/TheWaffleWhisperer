const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Some information on what the bot is for"),

  async execute(interaction, client) {
    const infoEmbed = new EmbedBuilder()
      .setTitle("General Information")
      .setDescription(
        "I am The Waffle Whisperer. That what you whisper to me, I will whisper to the moderators of the server, but without mentioning your name.\n\nThe sole purpose of his is to give anonymous feedback to the moderation team, meaning that there is no way for them to figure out it was you, other than the specific text you may send. To send a whisper, use the `/whisper` command, you can also do this in my DMs if you want, fill out a few short questions, and finally press enter. This will then make a so called modal pop up, in which you can explain in detail what it is you wanted to share. Once you send the modal, it will go directly to the moderators at WafCorp.\n\n**Please note** that, altough your privacy is 100% guaranteed, any abuse of this system will still result in you getting blacklisted, since the moderators will get the option to blacklist a user from whom they recieved a message. So please use it for the intended purpose only!"
      )
      .setColor(client.color)
      .setFooter({
        iconURL: client.user.displayAvatarURL(),
        text: "*Insert whispering noises*",
      });

    await interaction.reply({
      embeds: [infoEmbed],
      ephemeral: true,
    });
  },
};
