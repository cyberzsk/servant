const { ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');
const { memberIdsFromString, highestRole } = require('../../utils');

const metadata = {
  name: 'ban',
  type: ApplicationCommandType.ChatInput,
  description: 'ban users from the server!',
  options: [
    {
      name: 'users',
      type: ApplicationCommandOptionType.String,
      description: 'users to be banned from the server',
      required: true
    },
    {
      name: 'reason',
      type: ApplicationCommandOptionType.String,
      description: 'reason to ban users from the server'
    }
  ]
};

const run = async (interaction) => {
  const caller = interaction.member;
  const guild = interaction.guild;

  if(!caller.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: 'You have no ban members permission!', ephemeral: true });

  const usersString = interaction.options.getString('users');
  const reason = interaction.options.getString('reason');

  const userIds = memberIdsFromString(usersString);
  const members = await interaction.guild.members.fetch({ user: userIds, withPresences: false });

  const botBannableMembers = members.filter((member) => member.bannable);

  const callerIsOwner = guild.ownerId === caller.id;
  const callerHighestRole = highestRole(caller);
  const userBannableMembers = botBannableMembers.filter((member) => callerIsOwner || highestRole(member).comparePositionTo(callerHighestRole));

  const bannedMembers = userBannableMembers.each(async (member) => await member.ban({ reason }));
  const notBannedMembers = members.filter((member) => !userBannableMembers.hasAny(member.id));

  const messages = [];
  if (userBannableMembers.size > 0) {
    const bannedMembersString = bannedMembers.map((member) => `${member}`).join(' ');
    messages.push(`Banned members: ${bannedMembersString}!`);
  }

  if (notBannedMembers.size > 0) {
    const notBannedMembersString = notBannedMembers.map((member) => `${member}`).join(' ');
    messages.push(`Not banned members: ${notBannedMembersString}!`);
  }

  if (messages.length > 0) {
    return await interaction.reply(messages.join('\n'));
  }

  return await interaction.reply('No member banned!');
};

module.exports = { metadata, run };
