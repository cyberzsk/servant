const { ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');
const { memberIdsFromString, highestRole } = require('../../utils');

const metadata = {
  name: 'unmute',
  type: ApplicationCommandType.ChatInput,
  description: 'unmute users in the server!',
  options: [
    {
      name: 'users',
      type: ApplicationCommandOptionType.String,
      description: 'users to be unmuted in the server',
      required: true
    },
    {
      name: 'reason',
      type: ApplicationCommandOptionType.String,
      description: 'reason to unmute users in the server'
    }
  ]
};

const run = async (interaction) => {
  const caller = interaction.member;
  const guild = interaction.guild;

  if (!caller.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: 'You have no moderate members permission!', ephemeral: true });

  const clientMember = await guild.members.fetch(interaction.client.user.id);

  if (!clientMember.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: 'I have no moderate members permission!', ephemeral: true });

  const usersString = interaction.options.getString('users');
  const reason = interaction.options.getString('reason');

  const userIds = memberIdsFromString(usersString);
  const members = await interaction.guild.members.fetch({ user: userIds, withPresences: false });

  const botModeratableMembers = members.filter((member) => member.moderatable);

  const callerIsOwner = guild.ownerId === caller.id;
  const callerHighestRole = highestRole(caller);

  const userModeratableMembers = botModeratableMembers.filter((member) => callerIsOwner || highestRole(member).comparePositionTo(callerHighestRole));

  const moderatedMembers = userModeratableMembers.filter((member) => member.isCommunicationDisabled());

  moderatedMembers.each(async (member) => await member.timeout(null, reason));

  const notModeratedUsers = userIds.filter((userId) => !moderatedMembers.hasAny(userId));

  const messages = [];
  if (moderatedMembers.size > 0) {
    const unmoderatedMembersString = userModeratableMembers.map((member) => `<@${member.user.id}>`).join(' ');
    messages.push(`Unmuted users: ${unmoderatedMembersString}!`);
  }

  if (notModeratedUsers.length > 0) {
    const notModeratedMembersString = notModeratedUsers.map((userId) => `<@${userId}>`).join(' ');
    messages.push(`Not unmuted users: ${notModeratedMembersString}!`);
  }

  if (messages.length > 0) {
    await interaction.reply(messages.join('\n'));
  }
};

module.exports = { metadata, run };
