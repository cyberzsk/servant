/*
    Servant - New Version
      ~ BY: .gg/cyberz
*/
const {Client, Events, GatewayIntentBits} = require('discord.js');
const dotenv = require('dotenv').config();

// Build a new client
const client = new Client({intents:[
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers
]});

client.once(Events.ClientReady, c => {
  console.log(`${c.user.tag} is ready!`);
});

client.login(process.env.token);
