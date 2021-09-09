import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
const { SlashCommandBuilder } = require('@discordjs/builders');


export default class help implements IBotInteraction {

    name(): string {
        return "help";
    } 

    help(): string {
        return "Gives a list of all commands available to you";
    }   
    
    cooldown(): number{
        return 2;
    }
    isThisInteraction(command: string): boolean {
        return command === "help";
    }

    data(): any {
        return new SlashCommandBuilder()
		.setName(this.name())
		.setDescription(this.help())
    }

    async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {
        const embed = new Discord.MessageEmbed();
        if (interaction.member.roles.cache.some((role: { name: string; }) => role.name === 'Student')){
            embed.setTitle('DisCourse Command List')
            .setDescription('Here are a list of our student commands.')
            .setColor('#5865F2')
            .addFields(
                {name:"/help", value:"Shows all available commands for that user"},
                {name:"/leaderboard", value:"Shows the top 10 members with the most points in the class"},
                {name:"/askq", value:"Ask a question that can be answered by other students or a teacher"},
                {name:"/replys", value:"Reply to a question another student has asked"},
                {name:"/answerq", value:"Answer an open-ended question a teacher has asked"},
            );
        }
        else if(interaction.member.roles.cache.some((role: { name: string; }) => role.name === 'Teacher')){
            embed.setTitle('DisCourse Command List')
            .setDescription('Here are a list of our teacher commands.')
            .setColor('#5865F2')
            .addFields(
                {name:"/help", value:"Shows all available commands for that user"},
                {name:"/attendance", value:"Sends a message to all students so that they can mark that they are present; the message will disappear after a certain amount of time"},
                {name:"/strike", value:"Mutes target user for certain amount of time and warns them with a custom message"},
                {name:"/announcement", value:"Sends a message visible to all students in a channel"},
                {name:"/replyt", value:"Reply to a question a student has asked"},
                {name:"/changepoints", value:"Change the number of points a student has by adding or subtracting a certain amount"},
                {name:"/leaderboard", value:"Shows the top 10 members with the most points in the class"},
                {name:"/mcq", value:"Create a multiple choice question that students can answer within a specified time and gives points if answered correctly"},
                {name:"/oeq", value:"Create an open-ended question that students can answer within a specified time and gives points if answered correctly"},
                {name:"/mcq", value:"Create a multiple choice question that students can answer within a specified time and gives points if answered correctly"},
            );
        }
        await interaction.reply({embeds: [embed], ephemeral: true});  
}
}
