import schedule from 'node-schedule';
import {FreeGames} from "../classes/FreeGames";

export const scheduleBotJob = async (data: any, client: any) => {
    try{
        schedule.scheduleJob(data?.newDateString, async function () {
            switch (data?.type) {
                case 'epic':
                    try {
                        console.log(`RUNNING EPIC JOB at ${new Date().toLocaleString()}`)
                        const data = await new FreeGames().printData('epic', client);
                        //schedule again
                        console.log(`Scheduling new EPIC JOB at ${new Date().toLocaleString()}`)
                        if(data?.newDateString) await scheduleBotJob(data, client);
                    } catch (error) {
                        console.error(error);
                    }
                    break;
                default:
                    throw new Error('Job option not found!')
            }
        });
    }
    catch (e) {
        console.error(e);
    }
};