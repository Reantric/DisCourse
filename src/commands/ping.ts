import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
const { SlashCommandBuilder } = require('@discordjs/builders');

export default class ping implements IBotInteraction {
    private readonly aliases = ["ping","pong"]

    name(): string {
        return "ping";
    } 

    help(): string {
        return "ping";
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
		.addStringOption((option:any) =>
		option.setName('input')
			.setDescription('The input to echo back')
			.setRequired(true));
    }

    async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {
        const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setCustomId('primary')
					.setLabel('Primary')
					.setStyle('PRIMARY'),
			);
		await interaction.reply({ content: 'Pong!', components: [row] });
    }
}