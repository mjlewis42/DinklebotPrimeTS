import {SlashCommandBuilder} from 'discord.js';
import {BuildMessage} from "../../exports/classes/messageEmbed";
import {OSRSClass} from "../../exports/classes/osrsClass";
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('osrs')
        .setDescription('Old School Runescape commands!')
        .addSubcommand(subcommand => subcommand
            .setName('player')
            .setDescription("Search OSRS 'Hiscores' by player name!")
                .addStringOption(option => option
                    .setName('name')
                    .setDescription('Search for player by name')
                    .setRequired(true))
            .addStringOption(option => option
                .setName('ironman-status')
                .setDescription('Search for player by name'))),
    async execute(interaction: any) {
        await interaction.deferReply();
        try {
            const embed = new BuildMessage();
            const osrsObj = new OSRSClass(interaction, embed);
            
            const response = await osrsObj.executeSubcommands();
            if(!response){
                await interaction.editReply({ embeds: [embed.errorMessage()] });
                await wait(7_000);
                await interaction.deleteReply();
            }
            else{
                await interaction.editReply({embeds: [response]});
            }
        }
        catch (e) {console.error(e);}
    },
};