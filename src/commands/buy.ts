import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
import * as db from "quick.db";
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');

export default class checkstrikes implements IBotInteraction {

    private readonly aliases = ["buy"]

    name(): string {
        return "buy";
    } 

    help(): string {
        return "buy";
    }   
    
    cooldown(): number{
        return 2;
    }
    isThisInteraction(command: string): boolean {
        return this.aliases.includes(command);
    }
    data(): any {
        return new SlashCommandBuilder()
        .setName(this.name())
        .setDescription(this.help())
        .addStringOption((option:any) => option.setName('role_name').setDescription('Enter a name for your custom role!'));
    }

    async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {
        const role_name = interaction.options.getString('role_name');
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('Select')
                    .setPlaceholder('Nothing selected')
                    .addOptions([
                        {
                            label: 'Select me',
                            description: 'This is a description',
                            value: 'first_option',
                        },
                        {
                            label: 'You can select me too',
                            description: 'This is also a description',
                            value: 'second_option',
                        },
                    ]),
            );

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Some title')
            .setURL('https://discord.js.org/')
            .setDescription('Some description here');

        await interaction.reply({ content: 'Pong!', ephemeral: true, embeds: [embed], components: [row] });
}
}