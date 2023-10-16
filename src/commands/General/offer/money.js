const { ApplicationCommandOptionType } = require('discord.js');

const metadata = {
  name: 'money',
  type: ApplicationCommandOptionType.Subcommand,
  description: 'Offer money to the bot!',
  options: [
    {
      name: 'quantity',
      type: ApplicationCommandOptionType.Integer,
      description: 'amount of money to offer'
    }
  ]
};

const run = async (interaction) => {
  const quantity = interaction.options.getInteger('quantity');
  await interaction.reply(`Offer of $${quantity} accepted!`);
};

module.exports = { metadata, run };
