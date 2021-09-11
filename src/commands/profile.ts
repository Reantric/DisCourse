import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
const { SlashCommandBuilder } = require('@discordjs/builders');
import * as db from "quick.db";


export default class profile implements IBotInteraction {

    name(): string {
        return "profile";
    } 

    help(): string {
        return "View any student's profile! You can only view your own profile if you\'re a student";
    }   
    
    cooldown(): number{
        return 2;
    }
    isThisInteraction(command: string): boolean {
        return command === "profile";
    }

    data(): any {
        return new SlashCommandBuilder()
		.setName(this.name())
		.setDescription(this.help())
        .addUserOption((option:any) => option.setName('target').setDescription('Select a user').setRequired(true));
    }
    perms(): "teacher" | "student" | "both" {
        return 'both';
     }

    async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {
        const user = interaction.options.getUser('target');
        let embed = new Discord.MessageEmbed();
        if (interaction.member!.roles?.cache.some((role: { name: string; }) => role.name === 'Teacher')){
            embed.setTitle(`${interaction.user.username}'s Profile`)
            .setDescription(`Here is your info!`)
            .setAuthor(user.username,user.avatarURL()!)
            .setColor('#2cff00')
            .addField(`Points`,`**${db.get(`${user.id}.points`)}**`,true)
            .addField(`Strikes`,`**${db.get(`${user.id}.strikes`)}**`,true)
            .setThumbnail(user.avatarURL()!)
            .setTimestamp(new Date())
            .setFooter('DisCourse Profile');
            await interaction.reply({content: `Here is ${user}'s profile`,embeds: [embed], ephemeral: true});  
        }
        else if(interaction.member.roles.cache.some((role: { name: string; }) => role.name === 'Student')){
            embed.setTitle(`${interaction.user.username}'s Profile`)
            .setDescription(`Here is your info!`)
            .setAuthor(interaction.user.username,interaction.user.avatarURL()!)
            .setColor('#2cff00')
            .addField(`Points`,`**${db.get(`${interaction.user.id}.points`)}**`,true)
            .addField(`Strikes`,`**${db.get(`${interaction.user.id}.strikes`)}**`,true)
            .setThumbnail(interaction.user.avatarURL()!)
            .setTimestamp(new Date())
            .setFooter('DisCourse');        
            await interaction.reply({content: `Here is your profile. Since you're a student, you can't view other students' profiles.`, embeds: [embed], ephemeral: true});  
        }
       }
}
