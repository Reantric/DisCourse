import { Client, Role, Interaction, CommandInteraction, User, RoleManager, GuildMemberRoleManager } from "discord.js";
import { EmbedBuilder } from "discord.js";
import { IBotInteraction } from "../api/capi";
const { SlashCommandBuilder } = require('@discordjs/builders');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

export default class profile implements IBotInteraction {

    name(): string {
        return "profile";
    } 

    help(): string {
        return "View any student's profile! You can only view your own profile if you\'re a student.";
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
        .addUserOption((option:any) => option.setName('target').setDescription('Select a user'));
    }
    perms(): "teacher" | "student" | "both" {
        return 'both';
    }

    private formatProfileEmbed(user: User) {
        const embed = new EmbedBuilder();
        embed.setTitle(`${user.username}'s Profile`)
        .setDescription(`Here is ${user.username}'s info!`)
        .setAuthor({name: user.username, iconURL: user.avatarURL()!})
        .setColor('Random')
        .addFields({
            name: 'Points',
            value: `**${db.get(`${user.id}.points`)}**`,
            inline: true
        })
        .addFields({
            name: 'Strikes',
            value: `**${db.get(`${user.id}.strikes`)}**`,
            inline: true
        })
        .addFields({
            name: 'Absences',
            value: `**${db.get(`${user.id}.absences`)}**`,
            inline: true
        })
        .setThumbnail(user.avatarURL()!)
        .setTimestamp(new Date())
        .setFooter({text: 'DisCourse Profile'});
        return embed;
    }

    async runCommand(interaction: CommandInteraction, Bot: Client): Promise<void> {
        let user = interaction.options.getUser('target');
        let roleManager = interaction.member!.roles as GuildMemberRoleManager;
        if (roleManager.cache.has('Teacher')) {
            if (!user) {
                user = interaction.user;
            }
            const embed = this.formatProfileEmbed(user);
            await interaction.reply({ 
                content: `Here is ${user}'s profile`,
                embeds: [embed], 
                ephemeral: true 
            });  
        } else if (roleManager.cache.has('Student')) {
            let message = (user ? 
                "Since you're a student, you can't view other students' profiles." : 
                'Here is your profile.');
            user = interaction.user;
            const embed = this.formatProfileEmbed(user);
            await interaction.reply({
                content: message, 
                embeds: [embed], 
                ephemeral: true
            });  
        }
    }
}
