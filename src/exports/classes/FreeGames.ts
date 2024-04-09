import axios from "axios";
import {EmbedBuilder} from "discord.js";
import {scheduleBotJob} from "../functions/jobScheduler";

export class FreeGames {
    private gamesArray: any = [];
    private futurePromotion: any;
    
    async getEpicGamesData(){
        try {
            const response = await axios.get('https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions');
            const epicGamesData = response?.data;
            this.processEpicGamesData(epicGamesData);
        } catch (e) {
            console.error(e);
        }
    }

    private processEpicGamesData(epicData: any) {
        const games = epicData?.data?.Catalog?.searchStore?.elements || [];
        const currentGames = games.filter((game: any) => game?.promotions?.promotionalOffers?.length > 0);
        const futureGames = games.filter((game: any) => !game?.promotions?.promotionalOffers?.length);
        this.buildEmbedMessages(currentGames, futureGames);
    }

    private buildEmbedMessages(currentGames: any[], futureGames: any[]): void {
        const currentPromotion = currentGames[0]?.promotions?.promotionalOffers[0];
        this.futurePromotion = futureGames[0]?.promotions?.upcomingPromotionalOffers[0]?.promotionalOffers[0];

        const embedMessage: EmbedBuilder = new EmbedBuilder()
            .setTitle(`Free EPIC Games -> ${new Date(currentPromotion?.promotionalOffers[0]?.startDate).toLocaleDateString()} to ${new Date(currentPromotion?.promotionalOffers[0]?.endDate).toLocaleDateString()}`)
            .setDescription("Stay informed about new free game releases by acquiring the <@&1227100930005274756> role in the <#854891072642613258> <:Bingqilin:1036124793721856060>")
            .setThumbnail('https://imgur.com/QWsk9YP.png')
            .setColor('Yellow')
            .addFields({
                name: "Current Games",
                value: this.getGamesList(currentGames),
                inline: true
            })
            .addFields({
                name: "Next Games",
                value: this.getGamesList(futureGames),
                inline: true
            })
            .addFields({
                name: ' ',
                value: '*Working on supporting Twitch Prime Loot and more!*'
            });
        this.gamesArray.push(embedMessage);
        this.getGameImage(currentGames)
    }

    private getGamesList(games: any[]): string {
        return games.map((game: any, i: number) => `${i + 1}: *${game.title}*`).join('\n');
    }
    
    private getGameImage(currentGames: any){
        currentGames.forEach((game: any) => {
            const thumbnail = game?.keyImages.find((keyword: any) => keyword.type === "Thumbnail");
            if (thumbnail?.url) {
                this.gamesArray.push(new EmbedBuilder()
                    .setURL('https://store.epicgames.com/en-US/')
                    .setImage(thumbnail?.url)
                    .setColor('Yellow'));
            }
        });
    }
    
    async printData(option: string, client: any) {
        const freeChannel = client.channels.cache.get('1225743397386719263');
        await freeChannel.bulkDelete(10);
        
        switch (option) {
            case "epic":
                await this.getEpicGamesData();
                await freeChannel.send({content: "<@&1227100930005274756>", embeds: this.gamesArray});
                
                const startDate = new Date(this.futurePromotion.startDate);
                startDate.setMinutes(startDate.getMinutes() + 15);
                this.futurePromotion.newDateString = startDate.toISOString();
                this.futurePromotion.type = 'epic';
                return this.futurePromotion;
            default:
                console.error('Option not found for printing game data!');
                return [];
        }
    }
}
