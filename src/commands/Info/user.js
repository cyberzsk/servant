const { ApplicationCommandType } = require('discord.js');

const subCommands = {
  avatar: require('./user/avatar.js'),
  banner: require('./user/banner.js'),
  info: require('./user/info.js')
};

const options = [];

Object.keys(subCommands).forEach((key) => {
  options.push(subCommands[key].metadata);
});

const metadata = {
  name: 'user',
  type: ApplicationCommandType.ChatInput,
  description: 'Retrieve information from an user!',
  options
};

const run = async (interaction) => {
  const subCommand = interaction.options.getSubcommand();
  await subCommands[subCommand].run(interaction);
};

module.exports = { metadata, run };
