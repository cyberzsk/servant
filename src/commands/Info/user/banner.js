const { ApplicationCommandOptionType } = require('discord.js');

const metadata = {
  name: 'banner',
  type: ApplicationCommandOptionType.Subcommand,
  description: 'Retrieve the banner of an user!',
  options: [
    {
      name: 'user',
      type: ApplicationCommandOptionType.User,
      required: true,
      description: 'User to retrieve banner from'
    }
  ]
};

const bannerOptions = { size: 2048 };

const run = async (interaction) => {
  const user = await interaction.options.getUser('user').fetch();
  const bannerURL = user.bannerURL(bannerOptions);
  await interaction.reply(`${bannerURL}`);
};

module.exports = { metadata, run };
