import {SlashCommandBuilder} from 'discord.js';
import {BuildMessage} from "../../exports/classes/messageEmbed";
import {OSRSClass} from "../../exports/classes/osrsClass";

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
        try {
            await interaction.deferReply();
            const osrsObj = new OSRSClass(interaction, new BuildMessage());
            const response = await osrsObj.executeSubcommands();
            if(!response){
                await interaction.editReply({ content: 'ERROR: Unable to find this player! [DELETING MESSAGE]' });
                setTimeout(async() => await interaction.deleteReply(), 4000);
                return;
            }
            await interaction.editReply({embeds: [response]});
        }
        catch (e) {console.error(e);}
    },
};