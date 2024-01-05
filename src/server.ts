import 'dotenv/config';
import path from 'node:path';
import fs from 'fs';
import { Client, Collection, GatewayIntentBits } from 'discord.js';

interface BotClient extends Client {
	commands: Collection<any, any>;
}

const client: BotClient = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildVoiceStates
	]
}) as BotClient;

client.commands = new Collection();

//reads from modules from commands folder
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) client.commands.set(command.data.name, command);
		else console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}


//reads from modules from events folder
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js') || file.endsWith('ts'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) client.once(event.name, (...args) => event.execute(...args));
	else client.on(event.name, (...args) => event.execute(...args));
}

client.login(process.env.WATTOBOT_TOKEN);
