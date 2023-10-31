const { ApplicationCommandOptionType } = require('discord.js');

const metadata = {
  name: 'avatar',
  type: ApplicationCommandOptionType.Subcommand,
  description: 'Retrieve the avatar of an user!',
  options: [
    {
      name: 'user',
      type: ApplicationCommandOptionType.User,
      required: true,
      description: 'User to retrieve avatar from'
    }
  ]
};

const avatarOptions = { size: 2048 };

const run = async (interaction) => {
  const user = interaction.options.getUser('user');
  const member = await interaction.guild.members.fetch(user);
  const avatarURL = member.avatarURL(avatarOptions) || user.avatarURL(avatarOptions);
  await interaction.reply(`${avatarURL}`);
};

module.exports = { metadata, run };
