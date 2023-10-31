const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

const metadata = {
  name: 'info',
  type: ApplicationCommandOptionType.Subcommand,
  description: 'Retrieve general info of an user!',
  options: [
    {
      name: 'user',
      type: ApplicationCommandOptionType.User,
      required: true,
      description: 'User to retrieve info from'
    }
  ]
};

const run = async (interaction) => {
  const user = await interaction.options.getUser('user').fetch();
  const member = await interaction.guild.members.fetch(user);
  const embed = new EmbedBuilder()
    .setColor(user.accentColor)
    .setTitle('User Info')
    .setDescription(`${user}`)
    .setThumbnail(member.avatarURL() || user.avatarURL())
    .addFields(
      {
        name: 'Username',
        value: `\`${user.username}\``
      },
      {
        name: 'ID',
        value: `\`${user.id}\``
      },
      {
        name: 'Created',
        value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
        inline: true
      },
      {
        name: 'Joined',
        value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`,
        inline: true
      },
      {
        name: 'Boosted',
        value: `<t:${Math.floor(member.premiumSinceTimestamp / 1000)}:R>`,
        inline: true
      }
    )
    .setTimestamp()
    .setImage(user.bannerURL({ size: 2048 }))
    .setFooter({ text: 'Servant', iconURL: interaction.client.user.avatarURL() });

  await interaction.reply({ embeds: [embed] });
};

module.exports = { metadata, run };
