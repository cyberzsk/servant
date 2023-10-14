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

client.login(process.env.token);
