import {BuildMessage} from "./messageEmbed";

export class RollClass{
    private interaction;
    private embed: BuildMessage;
    private user: string;
    private type: number;
    private number: number;
    
    constructor(interaction: any, embed: BuildMessage) {
        this.interaction = interaction;
        this.embed = embed;
        this.user = interaction.user.globalName;
        this.type = interaction?.options?.getString('type');
        this.number = interaction?.options?.getInteger('number');
    }
    getRollEmbed(){
        this.embed.setTitle(`:game_die: ${this.user}'s Roll :game_die:`);
        this.embed.setThumbnail("https://i.imgur.com/kN0fXRH.jpg");
        
        let total: number = 0;
        for(let i: number = 0; i < this.number; i++){
            let getRandom: number = Math.floor(Math.random() * this.type) + 1;
            this.embed.setField(`D${this.type}`, `${getRandom}`, true);
            total += getRandom;
        }
        this.embed.setDescription(`${this.number}D${this.type}\n**TOTAL: ${total}**`);
        
        return this.embed.getMessage();
    }
}