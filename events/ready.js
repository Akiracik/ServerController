const { ActivityType } = require('discord.js');
const rolKontrol = require('../functions/rolKontrol');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`${client.user.tag} olarak giriş yapıldı!`);

        client.user.setPresence({
            activities: [{ name: 'AkiCode System Controller | .gg/akicode', type: ActivityType.Streaming, url: 'https://www.twitch.tv/akicode' }],
            status: 'online',
        });

        // Her 2 dakikada bir rol kontrolü yap
        setInterval(() => rolKontrol(client), 1 * 60 * 1000);
    },
};