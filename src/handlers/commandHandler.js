const { glob } = require('fast-glob');
const { REST, Routes } = require('discord.js');
const { dirname } = require('path');

const appDir = dirname(require.main.filename);

const COMMANDS_GLOB = 'src/commands/*/*.js';

const commands = [];

const assocs = {};

const initApplicationCommands = async (options = {}) => {
  (await glob(COMMANDS_GLOB)).forEach((file) => {
    const command = require(`${appDir}/${file}`);
    commands.push(command.metadata);
    assocs[command.metadata.name] = command.run;
  });

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
