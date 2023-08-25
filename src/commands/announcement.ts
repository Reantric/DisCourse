import { ApplicationCommand, ApplicationCommandOption, ApplicationCommandStringOption, Client, CommandInteraction, Role, SlashCommandStringOption } from "discord.js";
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
        commandBuilder.addStringOption(
            (option: SlashCommandStringOption) =>
		    option.setName('topic')
			.setDescription('Topic: ').
            setRequired(true)
        );
        commandBuilder.addStringOption(
            (option: SlashCommandStringOption) =>
		    option.setName('body')
			.setDescription('Body: ').
            setRequired(true)
        );
        return commandBuilder;
    }
    
    perms(): "teacher" | "student" | "both" {
        return 'teacher';
    }

async runCommand(interaction: CommandInteraction, Bot: Client): Promise<void> {
    var role = interaction.guild!.roles.cache.find((role: Role) => role.name == 'Student') as Role;
    const channel: TextChannel = interaction.guild?.channels.cache.find((channel:any) => channel.name == 'announcements') as TextChannel;
        interaction.reply({content:"Creating announcement...", ephemeral:true});
        if (!interaction.isChatInputCommand()) return;
        let topic = interaction.options.getString("topic");
        let body = interaction.options.getString("body");
        let embed: EmbedBuilder = new EmbedBuilder();
        embed.setTitle("Announcement")
        .setColor('Random')
        .setDescription("This is an important message from your teacher.")
        .addFields({
            name: (topic ? topic : "Announcement"), 
            value: (body ? body : "")
        })
        .setThumbnail(interaction.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({text: 'Powered by DisCourse'})
        channel.send({content:`<@&${role.id}>`, embeds:[embed]}); 
    }
} //runcommand ends
