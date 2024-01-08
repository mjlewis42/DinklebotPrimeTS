import { SlashCommandBuilder } from 'discord.js';
import { BuildMessage } from '../../exports/classes/messageEmbed';
import {Pokedex} from "../../exports/classes/pokedexClass";
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pokedex')
        .setDescription('Search all things Pokémon related (WIP)')
        .addSubcommand(subcommand => subcommand
                .setName('pokemon')
                .setDescription('Search for a Pokémon by name or ID')
                .addStringOption(option => option
                        .setName('name')
                        .setDescription('Search for a Pokémon by name or ID')
                        .setRequired(true))
            .addBooleanOption(option => option
                .setName('shiny')
                .setDescription('is Shiny: true / false'))
        )
        .addSubcommand(subcommand => subcommand
                .setName('random')
                .setDescription('Returns a random Pokémon!')), //1-1025 total
    async execute(interaction: any) {
            await interaction.deferReply();

            const embed = new BuildMessage();
            const pokedexObj = new Pokedex(interaction, embed);
            
            const response = await pokedexObj.executeSubcommand();
            if(!response){
                await interaction.editReply({ embeds: [embed.errorMessage()] });
                await wait(7_000);
                await interaction.deleteReply();
            }
            else{
                await interaction.editReply({embeds: [response]});
            }
    },
};
