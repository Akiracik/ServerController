const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Belirtilen kullanıcının banını kaldırır')
        .addStringOption(option => 
            option.setName('kullanici_id')
                .setDescription('Ban kaldırılacak kullanıcının ID\'si')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('sebep')
                .setDescription('Banın kaldırılma sebebi')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const userId = interaction.options.getString('kullanici_id');
        const reason = interaction.options.getString('sebep');

        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok!', ephemeral: true });
        }

        try {
            const unbannedUser = await interaction.guild.members.unban(userId, reason);
            
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('🔓 Kullanıcının Banı Kaldırıldı')
                .setDescription(`${unbannedUser.tag} kullanıcısının banı kaldırıldı.`)
                .addFields(
                    { name: 'Banı Kaldırılan Kullanıcı', value: unbannedUser.tag, inline: true },
                    { name: 'Banı Kaldıran Yetkili', value: interaction.user.tag, inline: true },
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
            await interaction.reply({ content: 'Kullanıcının banı kaldırılırken bir hata oluştu.', ephemeral: true });
        }
    },
};