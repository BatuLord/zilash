const client = require("../index");
const { MessageEmbed } = require("discord.js");

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        await interaction.deferReply({ ephemeral: false }).catch(() => {});
        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd)
        return interaction.followUp({ content: "❌ -> Hata oluştu!" });
      
      


       const description = `Komutu çalıştırabilmen için ${cmd.permission} iznine sahip olmalısın!`
       .replace(`MODERATE_MEMBERS`, `\`Zaman Aşımı Uygula\``)
       .replace(`BAN_MEMBERS`, `\`Üyeleri Yasakla\``)
       .replace(`KICK_MEMBERS`, `\`Üyeleri At\``)
       .replace(`ADMINISTRATOR`, `\`Yönetici\``)
       .replace(`MANAGE_ROLES`, `\`Rolleri Yönet\``)

       if(cmd.permission) {
         const authorPerms = interaction.channel.permissionsFor(interaction.member)
         if(!authorPerms || !authorPerms.has(cmd.permission)) {
           const permEmbed = new MessageEmbed()
           .setColor("#28282B")
           .setTitle("Hata")
           .setDescription(description)
           return interaction.followUp({ embeds: [permEmbed]})
         }
       }
      

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        cmd.execute(client, interaction, args);
    }

    if (interaction.isContextMenu()) {
        await interaction.deferReply({ ephemeral: false });
        const command = client.slashCommands.get(interaction.commandName);
        if (command) command.execute(client, interaction);
    }
});
