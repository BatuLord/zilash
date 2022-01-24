const client = require("../index");
const db = require("quick.db")
let { prefix } = require("../config.json");
const { MessageEmbed } = require("discord.js");

client.on("messageCreate", async (message) => {
    if(message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(prefix)) return;

    const [cmd, ...args] = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);

    const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));

    if (!command) return;
    await command.execute(client, message, args);
});
