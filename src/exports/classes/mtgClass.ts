import axios from "axios";
import {BuildMessage} from "./messageEmbed";
import {EmbedBuilder} from "discord.js";

export class MTGClass {
    private readonly interaction: any;
    private msgEmb: BuildMessage;
    
    constructor(interaction: string, msgEmb: BuildMessage){
        this.interaction = interaction;
        this.msgEmb = msgEmb;
    }

    async executeSubcommand() {
        const subCommand = this.interaction.options.getSubcommand();
        switch(subCommand) {
            case 'card':
                return await this.cardSearch();
            case 'card-random':
                return await this.getCardRandom();
            default:
                throw new Error('Invalid subcommand');
        }
    }

    async getCardRandom(){
        try {
            const getCard = await axios.get("https://api.scryfall.com/cards/random");
            return this.getCardEmbed(getCard.data);
        }
        catch (e) {
            return false;
        }
    }
    
    async cardSearch(){
        const cardName = this.interaction.options.getString('name');
        let findCard: any = await this.getCardFuzzy(cardName);
        if(!findCard){
            const findCardAC = await this.getCardAutoComplete(cardName);
            if(!findCardAC) return false;
            findCard = await this.getCardFuzzy(findCardAC.data.data[0]);
        }
        const cardData = findCard?.data;
        if (!cardData) {return false;}
        return this.getCardEmbed(cardData);
    }

    async getCardFuzzy(cardName: string){
        try {
            return await axios.get(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
        }
        catch (e) {
            return false;
        }
    }
    
    async getCardExact(cardExactName: string){
        try {
            return await axios.get(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardExactName)}`);
        }
        catch (e) {
            return false;
        }
    }
    
    async getCardAutoComplete(cardName: string){
        try {
            const getCardAC = await axios.get(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(cardName)}`);
            if(getCardAC.data.data.length <= 0) return false;
            return getCardAC;
        }
        catch (e) {
            return false;
        }
    }
    
    getCardEmbed(cardData: any){
        let {name, set_name, rarity, released_at, prices: {usd: priceUSD}} = cardData;
        const normalImage = cardData?.image_uris?.normal || cardData?.image_uris?.png;
        const embedArray = [];
        
        this.msgEmb.setTitle(name);
        this.msgEmb.setColor(getRarityColor(rarity));
        this.msgEmb.setImage(normalImage);
        this.msgEmb.setURL('https://cards.scryfall.io');
        this.msgEmb.setDescription(`**Set**: ${set_name}`);
        this.msgEmb.setField("Price", priceUSD ? `$${priceUSD}` : 'N/A', true);
        this.msgEmb.setField("Rarity", `${rarity}`, true);
        this.msgEmb.setField("Release", `${released_at}`, true);
        
        const links = generateLinks(cardData);
        this.msgEmb.setField("Links", links.trim());

        embedArray.push(this.msgEmb.getMessage());
        
        if(cardData.card_faces && !normalImage){
            embedArray.push(
                new EmbedBuilder()
                    .setURL('https://cards.scryfall.io')
                    .setImage(cardData.card_faces[0].image_uris.large)
            );
            embedArray.push(
                new EmbedBuilder()
                    .setURL('https://cards.scryfall.io')
                    .setImage(cardData.card_faces[1].image_uris.large)
            );
        }
        return embedArray;
    }
}

function getRarityColor(rarity: string): string {
    const RARITY_COLORS = {
        common: '#000000',
        uncommon: '#C0C0C0',
        rare: '#FFD700',
        mythic: '#A05822',
        default: '#ffffff'
    };
    
    return RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] || RARITY_COLORS.default;
}

function generateLinks(cardData: any): string {
    const linksArray = [];
    if (cardData?.purchase_uris) {
        if (cardData.purchase_uris.tcgplayer) linksArray.push(`[TCGplayer](${cardData.purchase_uris.tcgplayer})`);
        if (cardData.purchase_uris.cardhoarder) linksArray.push(`[Cardhoarder](${cardData.purchase_uris.cardhoarder})`);
        if (cardData.purchase_uris.cardmarket) linksArray.push(`[cardmarket](${cardData.purchase_uris.cardmarket})`);
    }
    return linksArray.join(' | ');
}