import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
import * as db from "quick.db";
const { SlashCommandBuilder } = require('@discordjs/builders');
const marked: Discord.Collection<string,boolean> = new Discord.Collection();
let msgToHold: Discord.Message;

export default class add_q implements IBotInteraction {
    private readonly aliases = ["mcq"]

    name(): string {
        return "mcq";
    }

    help(): string {
        return "mcq";
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
    .addSubcommand((subcommand:any) =>
            subcommand
            .setName('server')
            .setDescription('Info about the server'));
}

async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {
    const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setCustomId('primary')
					.setLabel('Primary')
					.setStyle('PRIMARY'),
			);
    interaction.reply({ content: ``, components: [row] })
}


}