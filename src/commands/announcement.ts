import { Client, Role } from "discord.js";
import { TextChannel } from "discord.js";
import { EmbedBuilder } from "discord.js";
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
        const commandBuilder = new SlashCommandBuilder();
        commandBuilder.setName(this.name());
        commandBuilder.setDescription(this.help());
        commandBuilder.addStringOption({
            name: 'topic',
            description: 'Topic: ',
            setRequired: true
        });
        commandBuilder.addStringOption({
            name: 'body',
            description: 'Body: ',
            setRequired: true
        });
        return commandBuilder;
    }
    
    perms(): "teacher" | "student" | "both" {
        return 'teacher';
    }

async runCommand(interaction: any, Bot: Client): Promise<void> {
    var role = interaction.guild!.roles.cache.find((role: Role) => role.name == 'Student') as Role;
    const channel: TextChannel = interaction.guild?.channels.cache.find((channel:any) => channel.name == 'announcements') as TextChannel;
            interaction.reply({content:"Creating announcement...", ephemeral:true});
            let embed: EmbedBuilder = new EmbedBuilder();
            embed.setTitle("Announcement")
            .setColor('Random')
            .setDescription("This is an important message from your teacher.")
            .addFields(interaction.options.getString("topic"),interaction.options.getString("body"))
            .setThumbnail(interaction.user.displayAvatarURL)
            .setTimestamp()
            .setThumbnail(interaction.user.displayAvatarURL)
            .setFooter({text: 'Powered by DisCourse'})
            channel.send({content:`<@&${role.id}>`, embeds:[embed]});
            
    }
} //runcommand ends
