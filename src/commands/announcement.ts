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
    .addSubcommand((subcommand:any) =>
		subcommand
			.setName('signup')
			.setDescription('Give students the "Student" role'))
    .addSubcommand((subcommand:any) =>
    subcommand
        .setName('announcement')
        .setDescription('Make an announcement')
        .addStringOption((option: any) => option.setName('topic').setDescription('Topic: ').setRequired(true))
        .addStringOption((option: any) => option.setName('body').setDescription('Body: ').setRequired(true)))
}
perms(): "teacher" | "student" | "both" {
    return 'teacher';
 }

async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {
    var role = interaction.guild!.roles.cache.find((role: Discord.Role) => role.name == 'Student') as Discord.Role;
    const channel: Discord.TextChannel = interaction.guild?.channels.cache.find((channel:any) => channel.name == 'announcements') as Discord.TextChannel;
    if (interaction.commandName === 'announcement') {
		if (interaction.options.getSubcommand() === 'signup') {
			const row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`signup`)
                        .setLabel(`I'm a Student`)
                        .setStyle('SUCCESS'),
                );
            
            interaction.reply({content:"Creating sign-up...", ephemeral:true});
            let embed: Discord.MessageEmbed = new Discord.MessageEmbed();
            embed.setTitle("Students!")
            .setColor("RANDOM")
            .setDescription("Click the button to be given the student role so you can participate (valid for 5 days).")
            .setTimestamp()
            .setThumbnail(interaction.user.displayAvatarURL)
            .setFooter(`Powered by DisCourse`)
            let msgToHold:any;
            channel.send({embeds:[embed], components: [row]}).then((msg:any)=>{
                msgToHold = msg;
            });

            setTimeout(() => {
                const row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('signup')
                        .setLabel(`Expired`)
                        .setStyle('SECONDARY')
                        .setDisabled(true),
                );
                msgToHold.edit({ content: `If you did not sign up, please contact your teacher.`, components: [row] });
        
            },5*24*60*60*1000);

            const filter = (i: Discord.ButtonInteraction) => i.customId === 'signup';
    
        const collector: Discord.InteractionCollector<Discord.ButtonInteraction> = interaction.channel!.createMessageComponentCollector(
            { filter, time: 5*24*60*60*1000 }
            );
        let num=0;
        collector.on('collect', async (i: Discord.ButtonInteraction) => {
            if (i.customId == 'signup'){
                i.deferUpdate();
                if ((i.member as Discord.GuildMember).roles.cache.has(role.id)){
                    i.followUp({content: "You are already a student!", ephemeral: true});
                } else {
                    i.followUp({content: `You are now a student. Welcome to the class!`, ephemeral:true});
                    (i.member as Discord.GuildMember).roles.add([role]);
                    num++;
                }
            }  
        });
    
        collector.on('end', async () => {
            const teachannel: Discord.TextChannel = interaction.guild?.channels.cache.find((channel:any) => channel.name == 'announcements') as Discord.TextChannel;
            let announcementinfo:Discord.MessageEmbed = new Discord.MessageEmbed();
            announcementinfo.setTitle("Student Sign-up")
            .setDescription("Here's how many students signed up.")
            .addField("Total:", num.toString())
            .setColor("WHITE")
            .setFooter(`Be sure to remind those who didn't sign up to do so or manually give them the student role.`)
            .setTimestamp()
            teachannel.send({embeds:[announcementinfo]})
        });
        }
        else{
            
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
    }
} //runcommand ends

}