const { Client, Collection, MessageEmbed, MessageAttachment, MessageActionRow, MessageButton, Permissions } = require("discord.js");
const db = require("quick.db");
const config = require("./config.json");
const client = new Client({
    intents: 32767
});
const { prefix } = require("./config.json");

module.exports = client;

client.commands = new Collection();
client.slashCommands = new Collection();

client.on('ready', async () => {
    console.log(`${client.user.tag} ismi ile giriş yapıldı.`)
})

require(`./handler`)(client);
 
client.login(config.token);

const aktivite = new Map();

client.on('messageCreate', async(message) => {
    if(!message.guild || message.author.bot || message.content.startsWith(prefix)) return;
    db.add(`mesajVeri.${message.author.id}.channel.${message.channel.id}`, 1);
    db.push(`mesajVeri.${message.author.id}.times`, {time: Date.now(), puan: 1})
  });
  
  client.on('voiceStateUpdate', (oldState, newState) => {
    if((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return
    if(!oldState.channelID && newState.channelID) { 
      aktivite.set(oldState.id, Date.now());
    }
        let data;
      if(!aktivite.has(oldState.id)){
          data = Date.now();
          aktivite.set(oldState.id, data); 
      } else data = aktivite.get(oldState.id);
    
      let duration = Date.now() - data;
      if(oldState.channelID && !newState.channelID) { 
          aktivite.delete(oldState.id);
          db.add(`voiceData.${oldState.id}.channel.${oldState.channelID}`, duration);
          db.push(`voiceData.${oldState.id}.times`, {time: Date.now(), puan:  duration})
      } else if(oldState.channelID && newState.channelID){
          aktivite.set(oldState.id, Date.now());
          db.add(`voiceData.${oldState.id}.channel.${oldState.channelID}`, duration);
          db.push(`voiceData.${oldState.id}.times`, {time: Date.now(), puan:  duration})
      }
});