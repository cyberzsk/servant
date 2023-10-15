const metadata = {
  name: 'ping',
  description: 'Replies with pong!'
};

const run = async (interaction) => {
  await interaction.reply('Pong!');
};

module.exports = { metadata, run };
