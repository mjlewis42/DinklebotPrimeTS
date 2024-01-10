import { BuildMessage } from "./messageEmbed";
import axios from "axios";
import { capitalizeFirstLetters } from "../functions/capitalize";

export class OSRSClass {
    private interaction;
    private readonly playerName: string;
    private imType: string | undefined;
    private imEmoji: string | undefined;
    private imColor: string | undefined;

    constructor(interaction: any) {
        this.interaction = interaction;
        this.playerName = interaction?.options?.getString('name');
        this.imType = this.interaction.options.getString('ironman-status');
    }

    async executeSubcommands() {
        const subCommand = this.interaction.options.getSubcommand();
        switch (subCommand) {
            case 'player':
                return await this.playerHiscore();
            case 'ge':
                console.log('inside ge')
                return 'test';
            default:
                throw new Error('Invalid subcommand');
        }
    }

    async playerHiscore() {
        try {
            const getPlayer = await this.getAccountType();
            let playerStats = mapData(getPlayer);
            return {
                ironmanType: {
                    type: this.imType,
                    emoji: this.imEmoji,
                    color: this.imColor
                },
                mappedData: playerStats,
                orderedSkills: getSkillsOrdered(playerStats)
            };
        }
        catch (e) { return false; }
    }

    async getAccountType() {
        const status = this.interaction.options.getString('status');
        try {
            if (status) {
                switch (status) {
                    case 'Standard ironman':
                        return await this.getIMPlayer();
                    case 'Hardcore ironman':
                        return await this.getHCIMPlayer();
                    case 'Ultimate ironman':
                        return await this.getUIMPlayer();
                    default:
                        throw new Error('Invalid subcommand');
                }
            }
            return await this.getPlayer();
        } catch (e) {
            return false;
        }
    }

    async getPlayer() {
        try {
            const player = await axios.get(`https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${this.playerName}`);
            return player.data;
        }
        catch (e) { return false; }
    }

    async getIMPlayer() {
        try {
            const testIM = await axios.get(`https://secure.runescape.com/m=hiscore_oldschool_ironman/index_lite.ws?player=${this.playerName}`);
            this.imType = "IM"
            this.imEmoji = "<:im:1194431015981162536>"
            this.imColor = COLOR[this.imType];
            return testIM.data;
        }
        catch (e) { return false; }
    }

    async getUIMPlayer() {
        try {
            const testUIM = await axios.get(`https://secure.runescape.com/m=hiscore_oldschool_ultimate/index_lite.ws?player=${this.playerName}`);
            this.imType = "UIM"
            this.imEmoji = "<:uim:1194431040899526677>"
            this.imColor = COLOR[this.imType];
            return testUIM.data;
        }
        catch (e) { return false; }
    }

    async getHCIMPlayer() {
        try {
            const testHCIM = await axios.get(`https://secure.runescape.com/m=hiscore_oldschool_hardcore_ironman/index_lite.ws?player=${this.playerName}`);
            this.imType = "HCIM"
            this.imEmoji = "<:hcim:1194430980828709025>"
            this.imColor = COLOR[this.imType];
            return testHCIM.data;
        }
        catch (e) { return false; }
    }
}

export function mapData(data: string): any[] {
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

const COLOR: any = {
    NORMAL: '#FFD700',
    IM: '#808080',
    UIM: '#FFFFFF',
    HCIM: '#5C0000'
}

function getSkillsOrdered(playerStats: any) {
    let skillsOrdered = [
        playerStats[1].level, // Attack
        playerStats[4].level, // Hitpoints
        playerStats[15].level, // Mining
        playerStats[3].level, // Strength
        playerStats[17].level, // Agility
        playerStats[14].level, // Smithing
        playerStats[2].level, // Defence
        playerStats[16].level, // Herblore
        playerStats[11].level, // Fishing
        playerStats[5].level, // Ranged
        playerStats[18].level, // Thieving 
        playerStats[8].level, // Cooking
        playerStats[6].level, // Prayer
        playerStats[13].level, // Crafting
        playerStats[12].level, // Firemaking
        playerStats[7].level, // Magic
        playerStats[10].level, // Fletching
        playerStats[9].level, // Woodcutting
        playerStats[21].level, // Runecrafting
        playerStats[19].level, // Slayer
        playerStats[20].level, // Farming
        playerStats[23].level, // Construction
        playerStats[22].level, // Hunter
    ];
    return skillsOrdered;
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

