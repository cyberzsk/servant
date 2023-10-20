const { readdirSync } = require('fs');
const { REST, Routes } = require('discord.js');
const { dirname } = require('path');

const appDir = dirname(require.main.filename);

const COMMANDS_PATH = `${appDir}/src/commands`;

const commands = [];

const assocs = {};

const initApplicationCommands = async (options = {}) => {
  for (const category of readdirSync(COMMANDS_PATH)) {
    const categoryPath = `${COMMANDS_PATH}/${category}`;
    const commandFiles = readdirSync(categoryPath).filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
      const commandPath = `${categoryPath}/${file}`;
      const command = require(commandPath);
      if ('metadata' in command && 'run' in command) {
        commands.push(command.metadata);
        assocs[command.metadata.name] = command.run;
      }
    }
  }

  const clientID = process.env.CLIENT_ID;
  const rest = new REST({ version: 10 }).setToken(process.env.token);
  await rest.put(Routes.applicationCommands(clientID), { body: commands });
};

const handleCommand = async (interaction) => {
  const command = assocs[interaction.commandName];
  if (command) {
    await command(interaction);
  }
};

module.exports = { initApplicationCommands, handleCommand };
