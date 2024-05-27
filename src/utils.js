const userMentionRegExp = /<@!*([0-9]+)>/;
const snowflakeRegExp = /([0-9]+)/;

const memberIdsFromString = (members) => {
  return members.split(' ').flatMap((member) => userMentionRegExp.exec(member)?.at(1) ?? snowflakeRegExp.exec(member)?.at(1) ?? []);
};

const highestRole = (member) => {
  return member.roles.highest;
};

module.exports = { memberIdsFromString, highestRole };
