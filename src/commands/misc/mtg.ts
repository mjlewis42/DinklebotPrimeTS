import {SlashCommandBuilder} from 'discord.js';
import {MTGClass} from "../../exports/classes/mtgClass";
import {BuildMessage} from "../../exports/classes/messageEmbed";
import {setTimeout as wait} from "node:timers/promises";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mtg')
        .setDescription('Magic the Gathering Commands')
        .addSubcommand(subcommand => subcommand
                .setName('card-random')
                .setDescription('Returns a random card!'))
        .addSubcommand(subcommand => subcommand
                .setName('card')
                .setDescription('Search for a MTG card (roughly) by name')
                .addStringOption(option => option
                    .setName('name')
                    .setDescription('Search for a MTG card (roughly) by name')
                    .setRequired(true)
                ))
        .addSubcommand(subcommand => subcommand
            .setName('id')
            .setDescription("Find MTG card by id: SET(3 characters) + ID([id/total #] id only, or '0[id]' ignoring first 0")
            .addStringOption(option => option
                .setName('set')
                .setDescription("3 letters (sometimes with #'s (40k)) located at the bottom of card (usually bottom left)")
                .setRequired(true))
            .addNumberOption(option => option
                .setName('id')
                .setDescription("Bottom of card (usually left) ex. formats: [id/total #] id only, or '0[id]' ignoring first 0")
                .setRequired(true))
            .addStringOption(option => option
                .setName('lg')
                .setDescription("Optional language filter by abbreviation: EN, JA, PT"))
        ),
    async execute(interaction: any) {
        try {
            await interaction.deferReply();

            const embed = new BuildMessage();
            const mtgObj = new MTGClass(interaction, embed);
            
            const result = await mtgObj.executeSubcommand();
            if(!result){
                await interaction.editReply({ embeds: [embed.errorMessage()] });
                await wait(7_000);
                await interaction.deleteReply();
            }
            else{
                await interaction.editReply({embeds: result});
            }
        }
        catch (e) {console.error(e);}
    },
};