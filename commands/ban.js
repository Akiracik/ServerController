const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Belirtilen kullanıcıyı banlar')
        .addUserOption(option => 
            option.setName('kullanici')
                .setDescription('Banlanacak kullanıcı')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('sebep')
                .setDescription('Ban sebebi')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const user = interaction.options.getUser('kullanici');
        const reason = interaction.options.getString('sebep');

        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok!', ephemeral: true });
        }

        try {
            await interaction.guild.members.ban(user, { reason });
            
            const embed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('🔨 Kullanıcı Banlandı')
                .setDescription(`${user.tag} başarıyla banlandı.`)
                .addFields(
                    { name: 'Banlanan Kullanıcı', value: user.tag, inline: true },
                    { name: 'Banlayan Yetkili', value: interaction.user.tag, inline: true },
                    { name: 'Sebep', value: reason }
                )
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });

            // Log kanalına mesaj gönderme
            const logChannel = interaction.guild.channels.cache.find(channel => channel.name === 'mod-log');
            if (logChannel) {
                await logChannel.send({ embeds: [embed] });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Kullanıcı banlanırken bir hata oluştu.', ephemeral: true });
        }
    },
};