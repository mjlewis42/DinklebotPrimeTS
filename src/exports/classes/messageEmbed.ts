export class BuildMessage {
    private messageEmbed: any;

    constructor() {
        this.messageEmbed = this.createDefaultEmbed();
    }

    private createDefaultEmbed() {
        return {
            color: parseInt('0x' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')),
            title: null,
            description: null,
            thumbnail: null,
            fields: [],
            image: null,
            url: null,
            footer: { text: 'Dinkle-Bot', iconURL: 'https://i.imgur.com/lHImYnD.png' },
            timestamp: new Date(),
        };
    }

    setColor(color: string) {this.messageEmbed.color = parseInt('0x' + color.substring(1), 16);}
    
    setURL(url: string) {this.messageEmbed.url = url;}

    setTitle(title: string) {this.messageEmbed.title = title;}

    setDescription(description: string) {this.messageEmbed.description = description;}

    setThumbnail(thumbnail: string) {this.messageEmbed.thumbnail = { url: thumbnail };}

    setImage(image: any) {this.messageEmbed.image = { url: image };}

    setField(name: string, value: string, inline: boolean = false) {this.messageEmbed.fields.push({ name, value, inline });}
    
    setFooter(footerText: string){this.messageEmbed.footer.text = footerText;}

    setAuthor(text: string, iconURL: string) {
        this.messageEmbed.footer.text = text;
        this.messageEmbed.footer.iconURL = iconURL;
    }

    getMessage() {return this.messageEmbed;}

    errorMessage() {
        this.setTitle("LOG ENTRY: [TRANSMISSION ERROR]");
        this.setDescription("Data Log Corruption Detected: Query Processing Failure" +
            "\n\n[INQUIRY DELETION IMMINENT]" +
            "\n\n*Resuming Standard Protocols...*");
        this.setThumbnail("https://i.imgur.com/pgkcRn9.png")
        this.setColor('#5C0000');
        return this.messageEmbed;
    }
}