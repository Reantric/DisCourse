import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
const { SlashCommandBuilder } = require('@discordjs/builders');
import * as db from "quick.db";
var qid = new db.table('id');
var questioninfo = new db.table('qs');

export default class replys implements IBotInteraction {

    name(): string {
        return "replys";
    }

    help(): string {
        return "replys";
    }   
    
    cooldown(): number{
        return 2;
    }
    isThisInteraction(command: string): boolean {
        return command === "replys";
    }
    data(): any {
    return new SlashCommandBuilder()
    .setName(this.name())
    .setDescription(this.help())
    .addStringOption((option:any) => option.setName('question').setDescription('Enter your question (just the question):').setRequired(true))
}
perms(): "teacher" | "student" | "both" {
    return 'student';
 }

async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {
}
}