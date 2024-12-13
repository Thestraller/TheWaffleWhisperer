const { SlashCommandBuilder } = require("@discordjs/builders");
const CryptoJS = require("crypto-js");

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
    )
    .addIntegerOption((option) =>
      option
        .setName("time")
        .setDescription(
          "Specify the time during which your description was/is important in timestamp format"
        )
        .setMinValue(1621966680)
        .setMaxValue(Math.floor(Date.now() / 1000))
    ),

  async execute(interaction, client) {
    let moderator = interaction.options.getString("moderator");
    let time = interaction.options.getInteger("time");
    let grade = interaction.options.getInteger("grade");
    let user = CryptoJS.AES.encrypt(interaction.member.id, process.env.key);
    
    //console.log(CryptoJS.AES.decrypt(user, process.env.key).toString(CryptoJS.enc.Utf8));

    if (!moderator) moderator = "None";
    if (!time) time = "None";
    else time = `<t:${time}>`

    await interaction.reply({
      content: `Moderator: ${moderator}\nTime: ${time}\nGrade: ${grade}\nUser: ${user}`,
    });
  },
};
