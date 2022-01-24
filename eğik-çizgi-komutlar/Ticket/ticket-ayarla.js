const {
    Client,
    MessageEmbed,
    MessageButton,
    MessageActionRow
} = require('discord.js');

const db = require("quick.db")

module.exports = {
  name: "ticket-ayarla",
  description: "Ticket sistemini ayarlarsınız!",
  options: [
        {
            name: "yetkili",
            description: "Ticket'e bakacak yetkili rolünü ayarlarsınız",
            type: "ROLE",
            required: true,
        },
        {
            name: "kategori",
            description: "Ticket kanalının oluşturulacağı kategori id'sini giriniz!",
            type: "STRING",
            required: true,
        }
    ],
  
    execute: async (client, interaction) => {

        const yetkiliRol = interaction.options.getRole("yetkili")
        const kategoriId = interaction.options.getString("kategori")

        if(isNaN(kategoriId)) {
            const geçersizEmbed = new MessageEmbed()
            .setTitle("Hata")
            .setDescription("Geçersiz bir kategori ID'si girdiniz!")
            .setColor("RED")
            interaction.followUp({ embeds: [geçersizEmbed] })
        }
    
        const ticketEmbed = new MessageEmbed()
        .setTitle("Ticket")
        .setDescription(":fast_forward: **Aşağıdaki butona tıklayarak destek oluşturabilirsin!**")

        const ticketButon = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('destek')
                .setLabel('🎫 Ticket oluştur!')
                .setStyle('PRIMARY'),
            );

        interaction.followUp({ embeds: [ticketEmbed], components: [ticketButon]})   
         db.set(`ticketKategori${interaction.guild.id}`, kategoriId)
         db.set(`ticketYetkili${interaction.guild.id}`, yetkiliRol.id)
 } 
};
