import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { SlashCommandBuilder } = require('@discordjs/builders');


export default class addpoints implements IBotInteraction {
    private readonly aliases = ["addpoints"]

    name(): string {
        return "addpoints";
    }

    help(): string {
        return "Manually award points to any student.";
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
    .addUserOption((option: any) => option.setName('target').setDescription('Select a student to give points to.').setRequired(true))
    .addIntegerOption((option:any) => 
        option.setName('points')
            .setDescription('How many points are you giving?')
            .setRequired(true));
}
perms(): "teacher" | "student" | "both" {
    return 'teacher';
 }

async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {
    const int1 = interaction.options.getInteger('points')
    const user = interaction.options.getMember('target');
    await db.add(`${user.id}.points`,int1)
    interaction.reply({content: `You added ${int1} point(s) to ${user}.`, ephemeral:true});
}
}