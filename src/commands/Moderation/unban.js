const { ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');
const { memberIdsFromString } = require('../../utils');

const metadata = {
  name: 'unban',
  type: ApplicationCommandType.ChatInput,
  description: 'unban users from the server!',
  options: [
    {
      name: 'users',
      type: ApplicationCommandOptionType.String,
      description: 'users to be unbanned from the server',
      required: true
    },
    {
      name: 'reason',
      type: ApplicationCommandOptionType.String,
      description: 'reason to unban users from the server'
    }
  ]
};

const run = async (interaction) => {
  const caller = interaction.member;
  const guild = interaction.guild;

  if (!caller.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: 'You have no ban members permission!', ephemeral: true });

  const clientMember = await guild.members.fetch(interaction.client.user.id);

  if (!clientMember.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: 'I have no ban members permission!', ephemeral: true });

  const usersString = interaction.options.getString('users');
  const reason = interaction.options.getString('reason');

  const userIds = memberIdsFromString(usersString);

  const bans = await guild.bans.fetch();
  const unbannedUsers = bans.filter((ban) => userIds.includes(ban.user.id)).mapValues((ban) => ban.user);

  unbannedUsers.each(async (user) => await guild.bans.remove(user.id, reason));

  const notUnbannedUsers = userIds.filter((userId) => !unbannedUsers.hasAny(userId));

  const messages = [];
  if (unbannedUsers.size > 0) {
    const unbannedUsersString = unbannedUsers.map((user) => `<@${user.id}>`).join(' ');
    messages.push(`Unbanned users: ${unbannedUsersString}!`);
  }

  if (notUnbannedUsers.length > 0) {
    const notUnbannedUsersString = notUnbannedUsers.map((user) => `<@${user}>`).join(' ');
    messages.push(`Not unbanned users: ${notUnbannedUsersString}!`);
  }

  if (messages.length > 0) {
    await interaction.reply(messages.join('\n'));
  }
};

module.exports = { metadata, run };
