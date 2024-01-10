import {createCanvas, loadImage} from "canvas";
import {capitalizeFirstLetters} from "../functions/capitalize";
import {BuildMessage} from "./messageEmbed";

export class CanvasClass {
    private interaction: any;
    private msgEmbed: BuildMessage;
    constructor(interaction: any, msgEmbed: BuildMessage){
        this.interaction = interaction;
        this.msgEmbed = msgEmbed;
    }
    
    async getOSRSPlayer(data: any){
        const canvas = createCanvas(204, 275);
        const ctx = canvas.getContext('2d');
        const template = await loadImage('./media/images/osrs/skill_template.png');
        
        ctx.drawImage(template, 0, 0, canvas.width, canvas.height);
        ctx.font = '14px OSRS';
        ctx.fillStyle = 'yellow';
        ctx.textAlign = 'center';

        let startingX: number = 46;
        let startingY: number = 23;

        for (let row: number = 0; row < 8; row++) {
            for (let column: number = 0; column < 3; column++) {
                let skill = data?.orderedSkills[row * 3 + column];
                if (column == 2 && row == 7) {
                    ctx.font = '10px OSRS-Bold';
                    ctx.fillText(data?.mappedData[0].tLevel, 168, 257);
                    break;
                }
                ctx.fillText(skill, startingX + column * 63, startingY + row * 32);
                ctx.fillText(skill, startingX + 14 + column * 63, startingY + 13 + row * 32);
            }
        }

        this.msgEmbed.setImage('attachment://skills.png');
        this.msgEmbed.setColor("#FFD700");
        if(data?.ironmanType.type){
            this.msgEmbed.setColor(data?.ironmanType?.color);
        }
        this.msgEmbed.setTitle(`${data?.ironmanType?.emoji ? data?.ironmanType?.emoji : ''} ${capitalizeFirstLetters(this.interaction.options.getString('name'))}`);
        return canvas.toBuffer('image/png');
    }
}