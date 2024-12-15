const {
  SlashCommandBuilder,
  EmbedBuilder,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const CryptoJS = require("crypto-js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whisper")
    .setDescription("Creates a modal in which you can describe your experience")
    .addIntegerOption((option) =>
      option
        .setName("grade")
        .setDescription(
          "Rating from 1-10, 1 being just a minor inconvenience and at 10 wanting to leave the server"
        )
        .setMinValue(1)
        .setMaxValue(10)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("moderator")
        .setDescription(
          "Specify a specific moderator or a group of moderators who are important for your description"
        )
        .setMaxLength(80)
    )
    .addIntegerOption((option) =>
      option
        .setName("time")
        .setDescription(
          "Specify the time during which your description was/is important in timestamp format"
        )
        .setMinValue(1621966680)
        //.setMaxValue(Math.floor(Date.now() / 1000))
    ),

  async execute(interaction, client) {
    let moderator = interaction.options.getString("moderator");
    let time = interaction.options.getInteger("time");
    let grade = interaction.options.getInteger("grade");
    let userID = interaction.user.id;

    guild = client.guilds.cache.get(process.env.guild1ID);
    member = guild.members.fetch(userID);
    if (!member) {
      await interaction.reply({
        content:
          "You need to be in the [Waffles Are Better Discord Server](<https://discord.gg/24qxN7eq59>) to be able to whisper to me.",
        ephemeral: true,
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
        ) == userID
      ) {
        await interaction.reply({
          content: `You appear to be blocked from using this feature. If you think this is a mistake, please contact [DrThestral](<https://discord.com/users/509752937388703744>).`,
          ephemeral: true,
        });
        return;
      }
    }

    let user = CryptoJS.AES.encrypt(userID, process.env.key);

    if (!moderator) moderator = "`not specified`";
    if (!time) time = "`not specified`";
    else time = `<t:${time}>`;

    const modal = new ModalBuilder()
      .setCustomId("whisperModal")
      .setTitle("Description");

    const textInput = new TextInputBuilder()
      .setCustomId("eventDescription")
      .setLabel("Describe your experience here")
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph)
      .setMaxLength(3_000);

    modal.addComponents(new ActionRowBuilder().addComponents(textInput));

    await interaction.showModal(modal);

    interaction
      .awaitModalSubmit({ time: 300_000 })
      .then((interaction) => {
        let desc = interaction.fields.getTextInputValue("eventDescription");
        const moderationEmbed = new EmbedBuilder()
          .setTitle("Palantir brings a new message...")
          .setDescription(
            `**Moderator:** \`${moderator}\`\n**Time:** ${time}\n**Grade:** \`${grade}\`\n**Encrypted User ID:** ||\`${user}\`||\n\n**Description**\n${desc}`
          )
          .setColor(client.color)
          .setImage(
            "https://media1.tenor.com/m/Sf4wqQIsd-oAAAAd/the-lord-of-the-rings-the-fellowship-of-the-ring-the-lord-of-the-rings.gif"
          )
          .setFooter({
            iconURL: client.user.displayAvatarURL(),
            text: "*Insert ominous whispering noises*",
          });

        client.channels.cache
          .get(process.env.channelID)
          .send({ embeds: [moderationEmbed] });

        interaction.reply({
          content: `**You sent the following:**`,
          embeds: [moderationEmbed],
          ephemeral: true,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  },
};
