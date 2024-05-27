const { ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');
const { memberIdsFromString, highestRole } = require('../../utils');

const metadata = {
  name: 'mute',
  type: ApplicationCommandType.ChatInput,
  description: 'timeout users in the server!',
  options: [
    {
      name: 'users',
      type: ApplicationCommandOptionType.String,
      description: 'users to be timed out in the server',
      required: true
    },
    {
      name: 'reason',
      type: ApplicationCommandOptionType.String,
      description: 'reason to time out users in the server'
    },
    {
      name: 'time',
      type: ApplicationCommandOptionType.Integer,
      description: 'duration of the time out'
    },
    {
      name: 'unit',
      type: ApplicationCommandOptionType.Integer,
      description: 'unit of time for duration',
      choices: [
        { name: 'seconds', value: 1000 },
        { name: 'minutes', value: 1000 * 60 },
        { name: 'hours', value: 1000 * 60 * 60 },
        { name: 'days', value: 1000 * 60 * 60 * 24 }
      ]
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
  const time = interaction.options.getInteger('time');
  const unit = interaction.options.getInteger('unit');
  const duration = time * unit || 0;

  const userIds = memberIdsFromString(usersString);
  const members = await interaction.guild.members.fetch({ user: userIds, withPresences: false });

  const botModeratableMembers = members.filter((member) => member.moderatable);

  const callerIsOwner = guild.ownerId === caller.id;
  const callerHighestRole = highestRole(caller);

  const userModeratableMembers = botModeratableMembers.filter((member) => callerIsOwner || highestRole(member).comparePositionTo(callerHighestRole));

  userModeratableMembers.each(async (member) => await member.timeout(duration, reason));

  const notModeratedUsers = userIds.filter((userId) => !userModeratableMembers.hasAny(userId));

  const messages = [];
  if (userModeratableMembers.size > 0) {
    const moderatedMembersString = userModeratableMembers.map((member) => `<@${member.user.id}>`).join(' ');
    messages.push(`Timed out users: ${moderatedMembersString}!`);
  }

  if (notModeratedUsers.length > 0) {
    const notModeratedMembersString = notModeratedUsers.map((userId) => `<@${userId}>`).join(' ');
    messages.push(`Not timed out users: ${notModeratedMembersString}!`);
  }

  if (messages.length > 0) {
    await interaction.reply(messages.join('\n'));
  }
};

module.exports = { metadata, run };
