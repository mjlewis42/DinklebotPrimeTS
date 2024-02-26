import {ActionRowBuilder, AnyComponentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events} from 'discord.js';

module.exports = {
    name: Events.ClientReady,
    async execute(interaction: any) {
        const channelId: string = '854891072642613258';
        const channel = await interaction.channels.cache.get(channelId);
        
        const roleCenterMessage:EmbedBuilder = getMessageEmbed();
        const roleCenterButton: ActionRowBuilder<AnyComponentBuilder> = getButtonEmbed();
        //await channel.send('image here');
        //await channel.send({embeds: [roleCenterMessage], components: [roleCenterButton]});
    }
};


const getMessageEmbed = () => {
    const message: EmbedBuilder = new EmbedBuilder()
        .setColor(0x6F2DA8)
        .setTitle('Role Assignment Hub')
        .setThumbnail('https://i.imgur.com/Tys1tds.gif')
        .setDescription('Click Buttons -> Get Roles <:gigachad:1032389253423960124>')
        .addFields(
            { name: '🎮 Gaming / General', value: 'Stay connected with notifications about gaming-related playgroups, server events, streams, and more from fellow members.'},
            { name: '🎴 Magic the Gathering', value: 'Get notified about Magic the Gathering playgroups on SpellTable and other MTG-related activities.'},
        )
        .setTimestamp()
    return message;
};

const getButtonEmbed = () => {
    const gamingGeneral: ButtonBuilder = new ButtonBuilder()
        .setCustomId('GG')
        .setLabel('Gaming / General')
        .setEmoji('🎮')
        .setStyle(ButtonStyle.Secondary);

    const mtg: ButtonBuilder = new ButtonBuilder()
        .setCustomId('MTG')
        .setLabel('Magic the Gathering')
        .setEmoji('🎴')
        .setStyle(ButtonStyle.Secondary);

    return new ActionRowBuilder()
        .addComponents(gamingGeneral, mtg);
}