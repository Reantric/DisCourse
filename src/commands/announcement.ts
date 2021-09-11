import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
const { SlashCommandBuilder } = require('@discordjs/builders');


export default class announcement implements IBotInteraction {
    private readonly aliases = ["announcement"]

    name(): string {
        return "announcement";
    }

    help(): string {
        return "announcement";
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
        .addStringOption((option: any) => option.setName('topic').setDescription('Topic: ').setRequired(true))
        .addStringOption((option: any) => option.setName('body').setDescription('Body: ').setRequired(true))
}
perms(): "teacher" | "student" | "both" {
    return 'teacher';
 }

async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {
    var role = interaction.guild!.roles.cache.find((role: Discord.Role) => role.name == 'Student') as Discord.Role;
    const channel: Discord.TextChannel = interaction.guild?.channels.cache.find((channel:any) => channel.name == 'announcements') as Discord.TextChannel;
            interaction.reply({content:"Creating announcement...", ephemeral:true});
            let embed: Discord.MessageEmbed = new Discord.MessageEmbed();
            embed.setTitle("Announcement")
            .setColor("RANDOM")
            .setDescription("This is an important message from your teacher.")
            .addField(interaction.options.getString("topic"),interaction.options.getString("body"))
            .setThumbnail(interaction.user.displayAvatarURL)
            .setTimestamp()
            .setThumbnail(interaction.user.displayAvatarURL)
            .setFooter(`Powered by DisCourse`)
            channel.send({content:`<@&${role.id}>`,embeds:[embed]});
            
    }
} //runcommand ends
