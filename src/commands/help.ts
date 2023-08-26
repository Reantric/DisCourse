import { Client, Role } from "discord.js";
import { EmbedBuilder } from "discord.js";
import { IBotInteraction } from "../api/capi";
const { SlashCommandBuilder } = require('@discordjs/builders');
import { helpUtil } from "..";
import { CommandAccess } from "../types";

export default class help implements IBotInteraction {

    name(): string {
        return "help";
    } 

    help(): string {
        return "A list of all commands available to you.";
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
    perms(): CommandAccess {
        return 'both';
     }

    async runCommand(interaction: any, Bot: Client): Promise<void> {
        let embed = new EmbedBuilder();
        let isTeacher = interaction.member!.roles?.cache.some((role: { name: string; }) => role.name === 'Teacher');
        embed.setTitle('DisCourse Command List')
        .setDescription(`Here are a list of our ${isTeacher ? 'teacher' : 'student'} commands.`)
        .setColor('Blurple');
        helpUtil.get().forEach((helpPerm: string[], name: string) => {
            if ((helpPerm[1] != 'student' && isTeacher) || (helpPerm[1] != 'teacher' && !isTeacher)) {
                embed.addFields({
                    name: '/' + name, 
                    value: helpPerm[0]
                });
            }
        })
        await interaction.reply({embeds: [embed], ephemeral: true});  
    }   
}
