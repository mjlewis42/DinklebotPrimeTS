import {BuildMessage} from "./messageEmbed";
import axios from "axios";

export class Pokedex {
    private interaction: any;
    private embed: BuildMessage;
    
    constructor(interaction: any, messageEmbed: BuildMessage){
        this.interaction = interaction;
        this.embed = messageEmbed;
    }
    
    async executeSubcommand(){
        const subCommand = this.interaction.options.getSubcommand();
        switch(subCommand){
            case 'pokemon':
                return await this.getPokemonNameID(this.interaction.options.getString('name').toLowerCase(), this.interaction.options.getBoolean('shiny'));
            case 'random':
                return await this.getPokemonRandom();
            default:
                throw new Error('Invalid subcommand');
        }
    }
    
    async getPokemonNameID(option: string | number, isShiny: boolean | undefined){
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${option}/`);
            return this.getPokedexEmbed(response.data, isShiny);
        } catch (error) {return false;}
    }
    
    async getPokemonRandom(){
        try {
            const randomNumber = Math.floor(Math.random() * 1025) + 1;
            const shiny = Math.floor(Math.random() * 14096) == 1;
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomNumber}/`);
            return this.getPokedexEmbed(response.data, shiny);
        }
        catch (e) {return false;}
    }

    async getEvolutionChain(speciesURL: string) {
        try {
            const species = await axios.get(speciesURL);
            const chain = await axios.get(species?.data?.evolution_chain?.url);
            return chain.data;
        } catch (error) {return false;}
    }
    
    async getPokedexEmbed(data: any, isShiny: boolean | undefined){
        const {name} = data;
        const type = data.types[0].type.name;
        const evolution = await this.getEvolutionChain(data?.species?.url);
        const evolutionArray: any = EvolutionChain(evolution);

        this.embed.setTitle(isShiny ? `:sparkles: ${Capitalize(name)} :sparkles:` : `${Capitalize(name)}`);
        this.embed.setColor(COLORS[type]);
        this.embed.setThumbnail(isShiny ? data.sprites.front_shiny : data.sprites.front_default);
        this.embed.setImage(isShiny ? data.sprites.other['official-artwork'].front_shiny : data.sprites.other['official-artwork'].front_default);
        this.embed.setField("Type", data.types.length == 1 ? Capitalize(data.types[0].type.name) : 
            `${Capitalize(data.types[0].type.name)} / ${Capitalize(data.types[1].type.name)}`, true);
        this.embed.setField("Height", `${data.height / 10} m`,true)
        this.embed.setField("Weight", `${(data.weight * 0.220462).toFixed(1)} lb(s)`,true)
        
        this.embed.setField("Evolutions", evolutionArray.map((evolution: any, i: number) => { return `${i+1}. ${Capitalize(evolution)}` }).join("\n"), true);
        this.embed.setField("Abilities", data.abilities.map((ability: any) => { return `${Capitalize(ability.ability.name)}` }).join("\n"), true)
        return this.embed.getMessage();
    }
}

const Capitalize = (word: string) => {return word.charAt(0).toUpperCase() + word.slice(1)}
function EvolutionChain(data: any) {
    const result: string[] = [];
    function traverseChain(chain: any) {
        if (chain.species) {result.push(chain.species.name);}
        if (chain.evolves_to && chain.evolves_to.length > 0) {for (const evolve of chain.evolves_to) {traverseChain(evolve);}}
    }
    traverseChain(data.chain);
    return result;
}

const COLORS: any = {
    "normal": "#A8A77A",
    "fire": "#EE8130",
    "water": "#6390F0",
    "electric": "#F7D02C",
    "grass": "#7AC74C",
    "ice": "#96D9D6",
    "fighting": "#C22E28",
    "poison": "#A33EA1",
    "ground": "#E2BF65",
    "flying": "#A98FF3",
    "psychic": "#F95587",
    "bug": "#A6B91A",
    "rock": "#B6A136",
    "ghost": "#735797",
    "dragon": "#6F35FC",
    "dark": "#705746",
    "steel": "#B7B7CE",
    "fairy": "#D685AD"
}