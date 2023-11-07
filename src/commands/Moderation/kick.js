const { ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');
const { memberIdsFromString, highestRole } = require('../../utils');

const metadata = {
  name: 'kick',
  type: ApplicationCommandType.ChatInput,
  description: 'Kick users from the server!',
  options: [
    {
      name: 'users',
      type: ApplicationCommandOptionType.String,
      description: 'users to be kicked from the server',
      required: true
    },
    {
      name: 'reason',
      type: ApplicationCommandOptionType.String,
      description: 'reason to kick users from the server'
    }
  ]
};

const run = async (interaction) => {
  const caller = interaction.member;
  const guild = interaction.guild;

  if (!caller.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ content: 'You have no kick members permission!', ephemeral: true });

  const clientMember = await guild.members.fetch(interaction.client.user.id);

  if (!clientMember.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ content: 'I have no kick members permission!', ephemeral: true });

  const usersString = interaction.options.getString('users');
  const reason = interaction.options.getString('reason');

  const userIds = memberIdsFromString(usersString);
  const members = await interaction.guild.members.fetch({ user: userIds, withPresences: false });

  const botKickableMembers = members.filter((member) => member.kickable);

  const callerIsOwner = guild.ownerId === caller.id;
  const callerHighestRole = highestRole(caller);
  const userKickableMembers = botKickableMembers.filter((member) => callerIsOwner || highestRole(member).comparePositionTo(callerHighestRole));

  const kickedMembers = userKickableMembers.each(async (member) => await member.kick(reason));
  const notKickedMembers = members.filter((member) => !userKickableMembers.hasAny(member.id));

  const messages = [];
  if (userKickableMembers.size > 0) {
    const kickedMembersString = kickedMembers.map((member) => `${member}`).join(' ');
    messages.push(`Kicked members: ${kickedMembersString}!`);
  }

  if (notKickedMembers.size > 0) {
    const notKickedMembersString = notKickedMembers.map((member) => `${member}`).join(' ');
    messages.push(`Not kicked members: ${notKickedMembersString}!`);
  }

  if (messages.length > 0) {
    return await interaction.reply(messages.join('\n'));
  }

  return await interaction.reply('No member kicked!');
};

module.exports = { metadata, run };
