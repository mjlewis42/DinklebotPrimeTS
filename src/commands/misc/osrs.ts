import { SlashCommandBuilder } from 'discord.js';
import { BuildMessage } from '../../exports/classes/messageEmbed';
import { createCanvas, loadImage, registerFont } from 'canvas';
import { OSRSClass, mapData } from '../../exports/classes/osrsClass';
import { capitalizeFirstLetters } from '../../exports/functions/capitalize';
const wait = require('node:timers/promises').setTimeout;

registerFont('./media/fonts/osrs-font.ttf', { family: 'OSRS' });
registerFont('./media/fonts/osrs-font-bold.ttf', { family: 'OSRS-Bold' });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('osrs')
        .setDescription('Fetch OSRS stats for a player')
        .addStringOption(option => option
            .setName('name')
            .setDescription('The player to fetch stats for')
            .setRequired(true)),
    async execute(interaction: any) {
        const msg = new BuildMessage()

        const canvas = createCanvas(204, 275);
        const ctx = canvas.getContext('2d');

        try {
            const OSRS = new OSRSClass(interaction, msg);
            let player: any = await OSRS.getPlayer();
            let playerStats = mapData(player);

            let skillsOrdered = [
                playerStats[1].level, // Attack
                playerStats[4].level, // Hitpoints
                playerStats[15].level, // Mining
                playerStats[3].level, // Strength
                playerStats[17].level, // Agility
                playerStats[14].level, // Smithing
                playerStats[2].level, // Defence
                playerStats[16].level, // Herblore
                playerStats[11].level, // Fishing
                playerStats[5].level, // Ranged
                playerStats[18].level, // Thieving 
                playerStats[8].level, // Cooking
                playerStats[6].level, // Prayer
                playerStats[13].level, // Crafting
                playerStats[12].level, // Firemaking
                playerStats[7].level, // Magic
                playerStats[10].level, // Fletching
                playerStats[9].level, // Woodcutting
                playerStats[21].level, // Runecrafting
                playerStats[19].level, // Slayer
                playerStats[20].level, // Farming
                playerStats[23].level, // Construction
                playerStats[22].level, // Hunter
            ];

            const template = await loadImage('./media/images/osrs/skill_template.png');
            ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

            ctx.font = '14px OSRS';
            ctx.fillStyle = 'yellow';
            ctx.textAlign = 'center';

            let startingX: number = 46;
            let startingY: number = 23;

            for (let row = 0; row < 8; row++) {
                for (let column = 0; column < 3; column++) {
                    let skill = skillsOrdered[row * 3 + column];
                    if (column == 2 && row == 7) {
                        ctx.font = '10px OSRS-Bold';
                        ctx.fillText(playerStats[0].tLevel, 168, 257);
                        break;
                    }
                    ctx.fillText(skill, startingX + column * 63, startingY + row * 32);
                    ctx.fillText(skill, startingX + 14 + column * 63, startingY + 13 + row * 32);
                }
            }

            const attachment = canvas.toBuffer('image/png');

            msg.setImage('attachment://skills.png');
            msg.setTitle(`${capitalizeFirstLetters(interaction.options.getString('name'))}`);

            await interaction.reply({
                embeds: [msg.getMessage()],
                files: [{ attachment, name: 'skills.png' },]
            });
        } catch (error) {
            console.error('Error:', error);
            await interaction.reply({ embeds: [msg.errorMessage()] });
            await wait(7_000);
            await interaction.deleteReply();
        }
    },
};
