/*
    Servant - New Version
      ~ BY: .gg/cyberz
*/
const { Client, GatewayIntentBits } = require('discord.js');
const { initApplicationCommands, handleCommand } = require('./src/handlers/commandHandler');
require('dotenv').config();

// Build a new client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

client.on('ready', async (client) => {
  await initApplicationCommands({ debug: false });
  console.log(`Bot ${client.user.tag} running!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  await handleCommand(interaction);
});

client.login(process.env.token);
