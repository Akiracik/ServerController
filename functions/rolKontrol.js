const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

async function sendLog(client, user, action) {
    const logChannel = client.channels.cache.get(config.logChannelId);
    if (logChannel) {
        try {
            const embed = new EmbedBuilder()
                .setColor(action === 'Rol Verildi' ? '#00FF00' : '#FF0000')
                .setTitle(action)
                .setDescription(`${user} kullanıcısının rolü ${action.toLowerCase()}.`)
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
            console.log(`Log mesajı gönderildi: ${user.tag} için ${action}`);
        } catch (error) {
            console.error('Log mesajı gönderilirken hata oluştu:', error);
        }
    } else {
        console.error(`Log kanalı bulunamadı. Kanal ID: ${config.logChannelId}`);
    }
}

async function rolKontrol(client) {
    console.log('Rol kontrolü başlatılıyor...');

    const mainGuild = client.guilds.cache.get(config.mainGuildId);
    const secondaryGuild = client.guilds.cache.get(config.secondaryGuildId);

    if (!mainGuild || !secondaryGuild) {
        console.log('Ana veya ikincil sunucu bulunamadı');
        return;
    }

    try {
        const mainMembers = await mainGuild.members.fetch();
        const secondaryMembers = await secondaryGuild.members.fetch();

        for (const [memberId, secondaryMember] of secondaryMembers) {
            const mainMember = mainMembers.get(memberId);

            if (!mainMember || !mainMember.roles.cache.has(config.mainRoleId)) {
                if (secondaryMember.roles.cache.has(config.secondaryRoleId)) {
                    await secondaryMember.roles.remove(config.secondaryRoleId);
                    await sendLog(client, secondaryMember.user, 'Rol Alındı');
                }
            } else {
                if (!secondaryMember.roles.cache.has(config.secondaryRoleId)) {
                    await secondaryMember.roles.add(config.secondaryRoleId);
                    await sendLog(client, secondaryMember.user, 'Rol Verildi');
                }
            }
        }

        console.log('Rol kontrolü tamamlandı.');
    } catch (error) {
        console.error('Rol kontrolü sırasında hata oluştu:', error);
    }
}

module.exports = rolKontrol;