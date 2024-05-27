const { ApplicationCommandOptionType, ApplicationCommandType } = require('discord.js');

const options = [
  {
    name: 'message',
    description: 'message to be sent',
    type: ApplicationCommandOptionType.String,
    required: true
  }
];

const metadata = {
  name: 'say',
  type: ApplicationCommandType.ChatInput,
  description: 'Say the message you want!',
  options
};

const run = async (interaction) => {
  const message = interaction.options.get('message');
  await interaction.reply(message.value);

};
module.exports = { metadata, run };
