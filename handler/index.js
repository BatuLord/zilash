const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const mongoose = require("mongoose");
const ascii = require("ascii-table")
const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    const commandFiles = await globPromise(`${process.cwd()}/komutlar/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }
    });

    const eventFiles = await globPromise(`${process.cwd()}/events/*.js`);
    eventFiles.map((value) => require(value));


    const slashTable = new ascii("Slash Komutlar")
    const slashCommands = await globPromise(
        `${process.cwd()}/eğik-çizgi-komutlar/*/*.js`
    );
    
    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);    
        if (!file?.name) 
        return slashTable.addRow(value.split("/")[7], "⚠️ -> Yüklenemedi", "İsim yazılmamış!")
        client.slashCommands.set(file.name, file);
        slashTable.addRow(file.name, "✅ -> Yüklendi")
        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });
    client.on("ready", async () => {
         await client.application.commands.set(arrayOfSlashCommands);
    });
    
    console.log(slashTable.toString());


};
