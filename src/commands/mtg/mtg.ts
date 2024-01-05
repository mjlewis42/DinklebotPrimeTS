import {SlashCommandBuilder} from 'discord.js';
import {MTGClass} from "../../exports/classes/mtgClass";
import {BuildMessage} from "../../exports/classes/messageEmbed";

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
        )),
    async execute(interaction: any) {
        try {
            const mtgObj = new MTGClass(interaction, new BuildMessage());
            const result = await mtgObj.executeSubcommand();
            if(!result) return await interaction.reply({ content: 'ERROR: I cant find this card!', ephemeral: true });
            await interaction.reply({embeds: result});
        }
        catch (e) {console.error(e);}
    },
};