import {SlashCommandBuilder} from "discord.js";
import {BuildMessage} from "../../exports/classes/messageEmbed";
import {setTimeout as wait} from "node:timers/promises";
import {RollClass} from "../../exports/classes/rollClass";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll [NUMBER_OF_DICE] dice of type [DICE_TYPE]!')
        .addIntegerOption(option =>
            option
                .setName('number')
                .setDescription('Number of dice to roll | MIN: 1, MAX:25')
                .setRequired(true)
                .setMaxValue(25)
                .setMinValue(1))
        .addStringOption(option =>
            option
                .setName('type')
                .setDescription('Type of Dice to roll')
                .addChoices(
                    { name: 'D100', value: '100' },
                    { name: 'D20', value: '20' },
                    { name: 'D12', value: '12' },
                    { name: 'D10', value: '10' },
                    { name: 'D8', value: '8' },
                    { name: 'D6', value: '6' },
                    { name: 'D4', value: '4' }
                )
                .setRequired(true)),
    async execute(interaction: any) {
        try {
            await interaction.deferReply();
            
            const rollObj = new RollClass(interaction, new BuildMessage());
            await interaction.editReply({embeds: [rollObj.getRollEmbed()]});
        }
        catch (e) {console.error(e);}
    }
};