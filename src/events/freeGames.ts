import {Events} from 'discord.js';
import {FreeGames} from "../exports/classes/FreeGames";
import {scheduleBotJob} from "../exports/functions/jobScheduler";

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client: any) {
        try {
            //get Free Epic Games
            const data = await new FreeGames().printData('epic', client, false);
            
            //schedule Epic Job
            await scheduleBotJob(data, client);
            
        } catch (error) {
            console.error(error);
        }
    }
};

