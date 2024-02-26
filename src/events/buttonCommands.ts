import {EmbedBuilder, Events} from 'discord.js';

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction: any) {
        try {
            if (!interaction.isButton()) { return; }
            //await interaction.deferReply();
            const buttonId: string = interaction.customId;
            const memberRoles = interaction.member?.roles;
            const embed: EmbedBuilder = new EmbedBuilder();

            const role = roles[buttonId];
            const checkRole = memberRoles.cache.has(role.id)

            if (role && memberRoles) {
                if (checkRole) await memberRoles.remove(role.id);
                else await memberRoles.add(role.id);
                embed.setTitle(`${checkRole ? 'Removed' : 'Added'} Role: ${buttonId}`);
                embed.setThumbnail(role.emoji);
                embed.setColor(role.color);
                console.log(`${new Date().toLocaleTimeString()} - ${checkRole ? 'Removed' : 'Added'} Role: ${role.name} for ${interaction.user.globalName}`)
            }

            await interaction.user.send({ embeds: [embed]});
            await interaction.deferUpdate();
            //await wait(2_000);
            //await interaction.deleteReply();
        }
        catch (e) {console.error(e)}
    },
};

const roles: any = {
    GG: {
        name: 'GG',
        id: '1203843104050913330',
        color: '#31b470',
        emoji: 'https://i.imgur.com/OAkodux.png',
    },
    MTG: {
        name: 'MTG',
        id: '1203843471761481778',
        color: '#c07a2d',
        emoji: 'https://i.imgur.com/g0ZDqB2.png',
    }
};
