const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandArrayDev = [];
    const commandFolders = fs.readdirSync("./src/commands");
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));
      const { commands, commandArray } = client;
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commands.set(command.data.name, command);
        if (folder === "admin") commandArrayDev.push(command.data.toJSON());
        else commandArray.push(command.data.toJSON());
      }
    }

    const clientId = process.env.clientID;
    const guildIds = [process.env.guild0ID, process.env.guild1ID];
    const rest = new REST({ version: "9" }).setToken(process.env.token);
    try {
      console.log("Started refreshing application (/) commands");

      await rest.put(Routes.applicationCommands(clientId), {
        body: client.commandArray,
      });

      for (const guildId of guildIds) {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
          body: commandArrayDev,
        });
      }
      console.log("Successfully reloaded application (/) commands");
    } catch (error) {
      console.error(error);
    }
  };
};
