const { ApplicationCommandType } = require('discord.js');

const metadata = {
  name: 'ping',
  type: ApplicationCommandType.ChatInput,
  description: 'Replies with pong!'
};

const run = async (interaction) => {
  await interaction.reply('Pong!');
};

module.exports = { metadata, run };
