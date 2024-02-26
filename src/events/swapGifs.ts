import {EmbedBuilder, Events} from 'discord.js';

module.exports = {
    name: Events.ClientReady,
    async execute(client: any) {
        try {
            if(process.env.NODE_ENV === 'DEV') return
            const embed: EmbedBuilder = new EmbedBuilder();
            const channelId: string = '854891072642613258';
            const messageId: string = '1204501973995622490';
            const channel = client.channels.cache.get(channelId);
            if (!channel) return console.error("UNABLE TO EDIT .GIF");
            const links: string[] = [
                'https://i.imgur.com/PHVFt6q.gif',
                'https://i.imgur.com/czaZ6sL.gif',
                'https://i.imgur.com/JIAamTY.gif',
                'https://i.imgur.com/iRj75M7.gif',
                'https://i.imgur.com/TPvGQrZ.gif',
                'https://i.imgur.com/461HSV1.gif',
                'https://i.imgur.com/qaKN6jV.gif',
                'https://i.imgur.com/dgBB5ga.gif'
            ];

            let currentIndex: number = 0;
            function rotateLinks() {
                embed.setImage(links[currentIndex]);
                embed.setColor(0x6F2DA8);
                channel.messages.fetch(messageId).then(async (message: any) => await message.edit({content: '', embeds: [embed]})).catch((error:any) => console.error(`ERROR SWAPPING GIFS: ${error}`));
                currentIndex = (currentIndex + 1) % links.length;
            }
            
            rotateLinks();
            setInterval(rotateLinks, 10000);
        }
        catch (e) {console.error(e)}
    },
};