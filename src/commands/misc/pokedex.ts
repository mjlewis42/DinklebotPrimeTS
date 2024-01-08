import { SlashCommandBuilder } from 'discord.js';
import { BuildMessage } from '../../exports/classes/messageEmbed';
import {Pokedex} from "../../exports/classes/pokedexClass";

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
            
            const pokedexObj = new Pokedex(interaction, new BuildMessage());
            const response = await pokedexObj.executeSubcommand();
            if(!response){
                await interaction.editReply({content: "ERROR: Could not find Pokedex result! [DELETING MESSAGE]"});
                setTimeout(async() => await interaction.deleteReply(), 4000);
                return;
            }
            await interaction.editReply({embeds: [response]});
    },
};
