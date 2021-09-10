import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
import * as db from "quick.db";
const { SlashCommandBuilder } = require('@discordjs/builders');


export default class addpoints implements IBotInteraction {
    private readonly aliases = ["addpoints"]

    name(): string {
        return "addpoints";
    }

    help(): string {
        return "addpoints";
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
            .setDescription('How many points is this question worth?')
            .setRequired(true));
}

async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {

    if(!(interaction.member.roles.cache.some((role: { name: string; }) => role.name === 'Teacher'))){
        interaction.reply({content: "Unfortunately, you cannot access this method because you do not have adminstrator privileges in the server.", ephemeral:true})
        return;
    }
    const int1 = interaction.options.getInteger('points')
    const user = interaction.options.getMember('target');//gets member
    //console.log(int1)
    db.add(`${user.id}.points`,int1)
    interaction.reply({content: `You added ${int1} point(s) to ${user}.`, ephemeral:true});
}
}