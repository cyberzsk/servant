const { ApplicationCommandType } = require('discord.js');

const subCommands = {
  money: require('./offer/money.js')
};

const options = [];

Object.keys(subCommands).forEach((key) => {
  options.push(subCommands[key].metadata);
});

const metadata = {
  name: 'offer',
  type: ApplicationCommandType.ChatInput,
  description: 'Offer something to the bot!',
  options
};

const run = async (interaction) => {
  const subCommand = interaction.options.getSubcommand();
  await subCommands[subCommand].run(interaction);
};

module.exports = { metadata, run };
