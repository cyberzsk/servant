const {glob} = require('fast-glob');
const {REST, Routes} = require('discord.js');
const dotenv = require('dotenv').config();
const {dirname} = require('path');
const appDir = dirname(require.main.filename);

const rest = new REST({ version: 10 }).setToken(process.env.token);

const COMMANDS_GLOB = 'src/commands/**/*.js';

const CLIENT_ID = process.env.CLIENT_ID;

let commands = [];

let assocs = {};

const initApplicationCommands = async (options) => {
  await loadGlobalCommands(options);
    
  const files = await glob(COMMANDS_GLOB);
    
  files.forEach((file) => {
	  const req = require(appDir + '/' + file);
	  commands.push(req.metadata);
	  assocs[req.metadata.name] = req.run;
	  if (options.debug) console.debug(`Loaded command ${req.metadata.name}`);
  });

  await manageCommands(options);
    
};

const loadGlobalCommands = async (options) => {
  const data = await rest.get(Routes.applicationCommands(CLIENT_ID));
  if (options.debug) console.debug(data);
};

const manageCommands = async (options) => {
  const data = await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
  if (options.debug) console.debug(data);
};

const handleCommand = async (interaction) => {
  const command = assocs[interaction.commandName];
  if (command) {
	  await command(interaction);
  }
};

module.exports = {initApplicationCommands, handleCommand};
