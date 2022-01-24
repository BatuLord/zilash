const {
    MessageActionRow,
    MessageButton
} = require('discord.js');

const {
    MessageEmbed
} = require('discord.js')

const db = require("quick.db")
const client = require('../index')

client.on("interactionCreate", async (interaction) => {

    const kullanıcı = interaction.user;
    const yetkili = db.get(`ticketYetkili${interaction.guild.id}`)
    const yetkiliRol = interaction.guild.roles.cache.get(yetkili)
    const everyone = interaction.guild.roles.cache.find(r => r.name == "@everyone")


    if (interaction.isButton()) {
        if (interaction.customId === 'destek') {
           const destek = interaction.guild.channels.create(`${interaction.user.username}-ticket`).then(async c => {
            db.set(`destek_${interaction.user.id}`, c.id)
            const category = db.get(`ticketKategori${interaction.guild.id}`)
            c.setParent(category.id)
            c.send({ content: `oluşturuldu`})
            c.overwritePermissions([
                {
                    id: kullanici.id,
                    allow: ['VIEW_CHANNEL','READ_MESSAGE_HISTORY','SEND_MESSAGES'],
                },
                {
                    id: yetkili.id,
                    allow: ['VIEW_CHANNEL','READ_MESSAGE_HISTORY','SEND_MESSAGES'],
                },
                {
                    id: herkes.id,
                    deny: ['VIEW_CHANNEL','READ_MESSAGE_HISTORY','SEND_MESSAGES'],
                },
            ]);
        })

            const destekEmbed = new MessageEmbed()
                .setTitle('Ticket')
                .setDescription('Merhaba! Destek ekibimiz yakında ilgilenecektir!')

            const ticketSil = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('sil')
                    .setLabel('Ticketi sil!')
                    .setStyle('DANGER'),
                );

            interaction.guild.channels.cache.get(destek).send({ embeds: [destekEmbed], components: [ticketSil] }).then(
                interaction.followUp({
                content: 'Ticket oluşturuldu!',
                ephemeral: true
            }))

        } else if (interaction.customId === 'sil') {

            const kanal = interaction.channels.cache.get(destek)
            kanal.delete();

        }
    }
})