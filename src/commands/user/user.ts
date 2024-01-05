import {SlashCommandBuilder} from 'discord.js';
import {User} from "../../exports/classes/userClass";
import {BuildMessage} from "../../exports/classes/messageEmbed";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('me')
        .setDescription('Check your server stats'),
    async execute(interaction: any) {
        try {
            const {id, globalName} = interaction.user;
            
            const user: User = new User(id, globalName);
            const getUser = await user.getCreateUser();
            
            const msg = new BuildMessage();
            msg.setTitle(`${globalName}'s Portfolio`);
            msg.setColor('#000000');
            msg.setField('Wallet', 'test', true);
            //msg.setField('Test Column', 'test', true);
           //msg.setField('Test Column', 'test', true);
            msg.setField('Roles', 'test role, test role, test role, test role, test role, test role');
            msg.setField('Achievements', 'test achievement\ntest achievement\ntest achievement\ntest achievement', true);
            msg.setField('', 'test achievement\ntest achievement\ntest achievement\ntest achievement\ntest achievement', true);
            msg.setField('', 'test achievement\ntest achievement\ntest achievement\ntest achievement\ntest achievement', true);

            await interaction.reply({embeds: [msg.getMessage()]});
        }
        catch (e) {console.error(e);}
    },
};
