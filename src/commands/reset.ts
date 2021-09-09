import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
import * as db from "quick.db";
const { SlashCommandBuilder } = require('@discordjs/builders');

export default class reset implements IBotInteraction {

    private readonly aliases = ["reset"]

    name(): string {
        return "reset";
    } 

    help(): string {
        return "reset";
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
        .addUserOption((option: any) => option.setName('target').setDescription('Select a student to reset strikes for').setRequired(true));
    }

    async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {
        if(!(interaction.member.roles.cache.some((role: { name: string; }) => role.name === 'Teacher'))){
            interaction.reply({content: "Unfortunately, you cannot access this method because you do not have adminstrator privileges in the server.", ephemeral:true})
            return;
        }
        const user = interaction.options.getMember('target');//gets member
        let role = user.guild.roles.cache.find((r:any) => r.name === "Student").id.toString();
        console.log(role)
        if(user.roles.cache.some((role:any) => role.name === 'Teacher')){
            interaction.reply({content: "Teachers don't have strikes, silly. You reset nothing.", ephemeral:true})
            return;
        }
        else{
            user.roles.set([role]);
        }
        db.set(`${user!.id}.strikes`,0);//reset student strikes
        console.log(db.get(`${user.id}.strikes`))
        interaction.reply({content: `You reset ${user}'s strikes to 0.`, ephemeral:true});
    }
}