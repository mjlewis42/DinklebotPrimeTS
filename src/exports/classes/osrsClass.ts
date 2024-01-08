import {BuildMessage} from "./messageEmbed";
import axios from "axios";
import {capitalizeFirstLetters} from "../functions/capitalize";

export class OSRSClass{
    private interaction;
    private embed: BuildMessage;
    private playerName: string;
    private IMType: string;
    private playerType: string = '';
    
    constructor(interaction: any, embed: BuildMessage) {
        this.interaction = interaction;
        this.playerName = interaction?.options?.getString('name');
        this.IMType = this.interaction.options.getString('ironman-status');
        this.embed = embed;
    }
    
    async executeSubcommands(){
        const subCommand = this.interaction.options.getSubcommand();
        switch(subCommand){
            case 'player':
                return await this.playerHiscore();
            default:
                throw new Error('Invalid subcommand');
        }
    }
    
    async playerHiscore(){
        try {
            const getPlayer = await this.getAccountType();
            return await this.getHiscoreEmbed(getPlayer);
        }
        catch (e) {return false;}
    }

    async getAccountType() {
        const status = this.interaction.options.getString('ironman-status');
        try {
            if(status){}
            return await this.getPlayer();
        } catch (e) {
            return false;
        }
    }
    
    async getPlayer(){
        try {
            const player = await axios.get(`https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${this.playerName}`);
            this.playerType = "NORMAL"
            return player.data;
        }
        catch (e) { return false;}
    }
    
    async getIMPlayer(){
        try {
            const testIM = await axios.get(`https://secure.runescape.com/m=hiscore_oldschool_ironman/index_lite.ws?player=${this.playerName}`);
            this.playerType = "IM"
            return testIM.data;
        }
        catch (e) { return false;}
    }
    
    async getUIMPlayer(){
        try {
            const testUIM = await axios.get(`https://secure.runescape.com/m=hiscore_oldschool_ultimate/index_lite.ws?player=${this.playerName}`);
            this.playerType = "UIM"
            return testUIM.data;
        }
        catch (e) { return false;}
    }
    
    async getHCIMPlayer(){
        try {
            const testHCIM = await axios.get(`https://secure.runescape.com/m=hiscore_oldschool_hardcore_ironman/index_lite.ws?player=${this.playerName}`);
            this.playerType = "HCIM"
            return testHCIM.data;
        }
        catch (e) { return false;}
    }
    
    async getHiscoreEmbed(data: any){
        const mappedData = mapData(data);
        this.embed.setTitle(`${capitalizeFirstLetters(this.playerName)}`);
        this.embed.setColor("#FFD700");
        this.embed.setDescription('Old School Runescape Hiscores | Work in progress');
        mappedData.map((activity, i: number) => {
            if(i == 0) this.embed.setField(activity?.name, activity?.tLevel, true);
            if(i > 0 && i < 24) this.embed.setField(activity?.name, activity?.level, true);
        });
        return this.embed.getMessage();
    }
}

function mapData(data: string): any[] {
    const lines: string[] = data.split('\n');
    const overallTemplate: string[] = ['rank', 'tLevel', 'tXP'];
    const skillsTemplate: string[] = ['rank', 'level', 'xp'];
    const activitiesTemplate: string[] = ['rank', 'total'];

    const mappedData: any[] = lines.map((line: string, i: number) => {
        const values: string[] = line.split(',');
        const mappedSkills: any = {};

        if (i < activities.length) {
            mappedSkills.name = activities[i];
            for (let j = 0; j < values.length; j++) {
                if (i === 0) mappedSkills[overallTemplate[j]] = parseInt(values[j]);
                else if (i > 0 && i <= 23) mappedSkills[skillsTemplate[j]] = parseInt(values[j]);
                else mappedSkills[activitiesTemplate[j]] = parseInt(values[j]);
            }
        }
        return mappedSkills;
    });

    return mappedData;
}

const COLOR = {
    NORMAL: '',
    IM: '',
    UIM: '',
    HCIM: ''
}

const activities: string[] = [
    'Overall',
    'Attack',
    'Defence',
    'Strength',
    'Hitpoints',
    'Ranged',
    'Prayer',
    'Magic',
    'Cooking',
    'Woodcutting',
    'Fletching',
    'Fishing',
    'Firemaking',
    'Crafting',
    'Smithing',
    'Mining',
    'Herblore',
    'Agility',
    'Thieving',
    'Slayer',
    'Farming',
    'Runecrafting',
    'Hunter',
    'Construction',
    'League Points',
    'Deadman Points',
    'Bounty Hunter - Hunter',
    'Bounty Hunter - Rogue',
    'Bounty Hunter (Legacy) - Hunter',
    'Bounty Hunter (Legacy) - Rogue',
    'Clue Scrolls (all)',
    'Clue Scrolls (beginner)',
    'Clue Scrolls (easy)',
    'Clue Scrolls (medium)',
    'Clue Scrolls (hard)',
    'Clue Scrolls (elite)',
    'Clue Scrolls (master)',
    'LMS - Rank',
    'PvP Arena - Rank',
    'Soul Wars Zeal',
    'Rifts closed',
    'Abyssal Sire',
    'Alchemical Hydra',
    'Artio',
    'Barrows Chests',
    'Bryophyta',
    'Callisto',
    'Cal\'varion',
    'Cerberus',
    'Chambers of Xeric',
    'Chambers of Xeric: Challenge Mode',
    'Chaos Elemental',
    'Chaos Fanatic',
    'Commander Zilyana',
    'Corporeal Beast',
    'Crazy Archaeologist',
    'Dagannoth Prime',
    'Dagannoth Rex',
    'Dagannoth Supreme',
    'Deranged Archaeologist',
    'Duke Sucellus',
    'General Graardor',
    'Giant Mole',
    'Grotesque Guardians',
    'Hespori',
    'Kalphite Queen',
    'King Black Dragon',
    'Kraken',
    'Kree\'Arra',
    'K\'ril Tsutsaroth',
    'Mimic',
    'Nex',
    'Nightmare',
    'Phosani\'s Nightmare',
    'Obor',
    'Phantom Muspah',
    'Sarachnis',
    'Scorpia',
    'Skotizo',
    'Spindel',
    'Tempoross',
    'The Gauntlet',
    'The Corrupted Gauntlet',
    'The Leviathan',
    'The Whisperer',
    'Theatre of Blood',
    'Theatre of Blood: Hard Mode',
    'Thermonuclear Smoke Devil',
    'Tombs of Amascut',
    'Tombs of Amascut: Expert Mode',
    'TzKal-Zuk',
    'TzTok-Jad',
    'Vardorvis',
    'Venenatis',
    'Vet\'ion',
    'Vorkath',
    'Wintertodt',
    'Zalcano',
    'Zulrah'
];
