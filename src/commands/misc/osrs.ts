import { SlashCommandBuilder } from 'discord.js';
import { BuildMessage } from '../../exports/classes/messageEmbed';
import { registerFont } from 'canvas';
import { OSRSClass } from '../../exports/classes/osrsClass';
import {CanvasClass} from "../../exports/classes/canvasCreation";
const wait = require('node:timers/promises').setTimeout;

registerFont('./media/fonts/osrs-font.ttf', { family: 'OSRS' });
registerFont('./media/fonts/osrs-font-bold.ttf', { family: 'OSRS-Bold' });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('osrs')
        .setDescription('Search OSRS player Hiscores or Grand Exchange!')
        .addSubcommand(subcommand => subcommand
            .setName('player')
            .setDescription("Search OSRS Hiscores by player name")
            .addStringOption(option => option
                .setName('name')
                .setDescription('Player name')
                .setRequired(true))
            .addStringOption(option =>
                option
                    .setName('status')
                    .setDescription('Search Ironman Hiscores | GIM equivalent API does not exist :(')
                    .addChoices(
                        { name: 'Standard ironman', value: 'Standard ironman' },
                        { name: 'Hardcore ironman', value: 'Hardcore ironman' },
                        { name: 'Ultimate ironman', value: 'Ultimate ironman' }
                    )))
        /*.addSubcommand(subcommand => subcommand
            .setName('ge')
            .setDescription("Search the OSRS Grand Exchange!")
            .addStringOption(option => option
                .setName('item-name')
                .setDescription('Name of item')
                .setRequired(true)))*/
        ,
    async execute(interaction: any) {
        await interaction.deferReply();
        const msg: BuildMessage = new BuildMessage();
        
        try {
            const OSRS:OSRSClass = new OSRSClass(interaction);
            
            let response: any = await OSRS.executeSubcommands();
            if(!response) throw new Error();

            if(interaction.options.getSubcommand() === 'player') {
                const canvas = new CanvasClass(interaction, msg);
                const attachment = await canvas.getOSRSPlayer(response);
                await interaction.editReply({
                    embeds: [msg.getMessage()],
                    files: [{attachment, name: 'skills.png'}]
                });
            }
            else{
                await interaction.editReply('Test');
            }
        } catch (error) {
            await interaction.editReply({ embeds: [msg.errorMessage()] });
            await wait(7_000);
            await interaction.deleteReply();
        }
    },
};
