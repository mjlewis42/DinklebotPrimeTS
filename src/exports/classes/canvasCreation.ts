import {createCanvas, loadImage} from "canvas";
import {capitalizeFirstLetters} from "../functions/capitalize";
import {EmbedBuilder} from "discord.js";

export class CanvasClass {
    private interaction: any;
    private msgEmbed: EmbedBuilder;
    constructor(interaction: any, msgEmbed: EmbedBuilder){
        this.interaction = interaction;
        this.msgEmbed = msgEmbed;
    }
    
    async getOSRSPlayer(data: any){
        const canvas = createCanvas(204, 275); // Double the width to accommodate two images side by side
        const ctx = canvas.getContext('2d');
        const skillTemplate = await loadImage('./media/images/osrs/skill_template.png');
        const bossTemplate = await loadImage('./media/images/osrs/boss_template.png');

        // Draw the first template image on the left
        ctx.drawImage(skillTemplate, 0, 0, canvas.width, canvas.height);
        // Draw the second template image on the right
        //ctx.drawImage(bossTemplate, canvas.width / 2, 0, canvas.width / 2, canvas.height);

        ctx.font = '14px OSRS';
        ctx.fillStyle = 'yellow';
        ctx.textAlign = 'center';

        let startingX: number = 46;
        let startingY: number = 23;

        for (let row: number = 0; row < 8; row++) {
            for (let column: number = 0; column < 3; column++) {
                //console.log(data)
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
        //this.msgEmbed.setThumbnail('attachment://skills.png');
        if(data?.ironmanType.type){this.msgEmbed.setColor(data?.ironmanType?.color);}
        this.msgEmbed.setTitle(`${data?.ironmanType?.emoji ? data?.ironmanType?.emoji : ''} ${capitalizeFirstLetters(this.interaction.options.getString('name'))}`);
        return canvas.toBuffer('image/png');
    }
}