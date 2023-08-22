import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { SlashCommandBuilder } = require('@discordjs/builders');

export default class strike implements IBotInteraction {

    private readonly aliases = ["strike"]

    name(): string {
        return "strike";
    } 

    help(): string {
        return "Manually strike a student for inappropriate behavior.";
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
        .addUserOption((option: any) => option.setName('target').setDescription('Select a student to strike').setRequired(true));
    }
    perms(): "teacher" | "student" | "both" {
        return 'teacher';
     }

    async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {
        if(!(interaction.member.roles.cache.some((role: { name: string; }) => role.name === 'Teacher'))){
            interaction.reply({content: "Unfortunately, you cannot access this method because you do not have adminstrator privileges in the server.", ephemeral:true})
            return;
        }
        const user = interaction.options.getMember('target');//gets member
        let role = user.guild.roles.cache.find((r:any) => r.name === "Mute").id.toString();
        //const role = interaction.options.getRole('muted');
        console.log(role) 
        //console.log(user)
        
        if(user.roles.cache.some((role:any) => role.name === 'Teacher')){//checks if teacher is given strike and denies it
            interaction.reply({content: "You can't strike another teacher!", ephemeral:true})
            return;
        }
        else{
            db.add(`${user!.id}.strikes`,1);//else strike student
            db.set(`${user.id}.points`,Math.max(0,db.get(`${user.id}.points`)-2));
        }

        if(db.get(`${user.id}.strikes`)>=3){//if a student has at least three strikes then given the Mute role
            if(user.roles.cache.some((role:any) => role.name === 'Mute')){
                interaction.reply({content: `This user has already been muted, but a strike was still added. This student now has ${db.get(`${user.id}.strikes`)} strike(s)`, ephemeral:true})
                return;
            }
            else{
                user.roles.set([role]);
            }
            
        }
        console.log('struck')
        console.log(db.get(`${user.id}.strikes`))
        interaction.reply({content: `You struck ${user}. This student now has ${db.get(`${user.id}.strikes`)} strike(s)`, ephemeral:true});
    }
}