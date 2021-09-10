import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
import * as db from "quick.db";
const { SlashCommandBuilder } = require('@discordjs/builders');

export default class checkstrikes implements IBotInteraction {

    private readonly aliases = ["check-strikes"]

    name(): string {
        return "check-strikes";
    } 

    help(): string {
        return "check-strikes";
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
        .addUserOption((option: any) => option.setName('target').setDescription('Which student do you want to check strikes for?').setRequired(true));
    }
    perms(): "teacher" | "student" | "both" {
        return 'teacher';
     }

    async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {
        
        const user = interaction.options.getMember('target');//gets member
        if(user.roles.cache.some((role:any) => role.name === 'Teacher')){
            interaction.reply({content: "Teachers don't have strikes, silly.", ephemeral:true})
            return;
        }
        else{
            interaction.reply({content: `This student has ${db.get(`${user.id}.strikes`)} strike(s)`, ephemeral:true});
        }
        
    }
}