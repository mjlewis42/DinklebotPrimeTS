﻿import { Events } from 'discord.js';

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction: any) {
        if (!interaction.isChatInputCommand()) { return; }
    },
};