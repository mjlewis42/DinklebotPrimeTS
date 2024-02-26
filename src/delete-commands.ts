const { REST, Routes } = require('discord.js');
import 'dotenv/config';

const rest = new REST().setToken(process.env.NODE_ENV === 'DEV' ? process.env.WATTOBOT_TOKEN : process.env.DINKLEBOT_TOKEN);
const clientID: any = process.env.NODE_ENV === 'DEV' ? process.env.WATTOBOT_CLIENTID : process.env.DINKLEBOT_CLIENTID
rest.put(Routes.applicationGuildCommands(clientID, process.env.GUILDID), { body: [] })
    .then(() => console.log('Successfully deleted all guild commands.'))
    .catch(console.error);

rest.put(Routes.applicationCommands(process.env.CLIENTID), { body: [] })
    .then(() => console.log('Successfully deleted all application commands.'))
    .catch(console.error);
