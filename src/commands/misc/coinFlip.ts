import { SlashCommandBuilder } from 'discord.js';
import { BuildMessage } from '../../exports/classes/messageEmbed';
import * as fs from 'fs';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cf')
        .setDescription('Flip a coin! Heads or Tails'),
    async execute(interaction: any) {
        const msg = new BuildMessage();
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';

        const filePath = result === 'Heads' ? './images/misc/coin_heads.png' : './images/misc/coin_tails.png';
        const fileName = result === 'Heads' ? 'coin_heads.png' : 'coin_tails.png';

        const fileBuffer = fs.readFileSync(filePath);

        msg.setTitle(`${interaction.user.globalName}'s Result: ${result}!`);
        msg.setColor(result === 'Heads' ? '#FF0000' : '#0000FF');
        msg.setImage(`attachment://${fileName}`);

        await interaction.reply({
            embeds: [msg.getMessage()],
            files: [{attachment: fileBuffer, name: fileName}]});
    },
};
