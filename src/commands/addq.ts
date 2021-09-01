import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
import * as db from "quick.db";
const { SlashCommandBuilder } = require('@discordjs/builders');


export default class add_q implements IBotInteraction {
    private readonly aliases = ["addq"]

    name(): string {
        return "addq";
    }

    help(): string {
        return "addq";
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
    
}
}