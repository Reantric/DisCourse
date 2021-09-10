import * as Discord from "discord.js";
import * as db from "quick.db";
import { IBotInteraction } from "../api/capi";
const { SlashCommandBuilder } = require('@discordjs/builders');

const marked: Discord.Collection<string,boolean> = new Discord.Collection();
let msgToHold: Discord.Message;

export default class attendance implements IBotInteraction {

    name(): string {
        return "attendance";
    } 

    help(): string {
        return "Attendance made easy!";
    }   
    
    cooldown(): number{
        return 6;
    }

    isThisInteraction(command: string): boolean {
        return command === this.name();
    }

    data(): any {
        return new SlashCommandBuilder()
		.setName(this.name())
		.setDescription(this.help())
		.addStringOption((option:any) =>
		option.setName('time')
			.setDescription('Enter a time! (in 24 hour format!)')
			.setRequired(true))
        .addIntegerOption((option:any) =>
            option.setName('exptime')
                .setDescription('The amount of time attendance is valid for!'));
    }

    async runCommand(interaction: Discord.CommandInteraction, Bot: Discord.Client): Promise<void> { // TODO: exptime is in seconds, change to minutes later
        let allRoleUsers = new Set();
        let copyRoleUsers = new Set();
        await interaction.guild!.members.fetch();
        let role = interaction.guild!.roles.cache.find((role: Discord.Role) => role.name == 'Student') as Discord.Role;
        interaction.guild!.members.cache.forEach((v: Discord.GuildMember) => {
            if (v.roles.cache.has(role!.id)){
                allRoleUsers.add(v);
                copyRoleUsers.add(v);
            }
        });

        //console.log(allRoleUsers);

        var exptime: number = interaction.options.getInteger('exptime') as number;
        if (exptime == null)
            exptime = 10;
        const time = interaction.options.getString('time')!.split(':');
        let ti: any = new Date();
        let now = new Date();
        ti.setHours(parseInt(time[0]));
        ti.setMinutes(parseInt(time[1]));
        ti.setSeconds(0);
        let ms = ti.getTime() - now.getTime();
        if (ms < 0){
            ms += 24*60*60*1000;
        }
        let endTime = new Date(ti.getTime() + exptime*60000);
      //  console.log(ms);
        await interaction.reply({ephemeral: true, content:`Attendance will appear at ${time[0].toString().padStart(2,"0")}:${time[1].toString().padStart(2,"0")} and end at ${endTime.getHours().toString().padStart(2,"0")}:${endTime.getMinutes().toString().padStart(2,"0")}`});
        setTimeout(() => {
            this.eric(Bot,interaction,exptime,allRoleUsers, role, copyRoleUsers);
            setInterval(this.eric,24*60*60*1000, Bot, interaction, exptime, allRoleUsers, role, copyRoleUsers);
        },ms) // ms
        
    }

    async eric(Bot: Discord.Client, interaction: Discord.CommandInteraction, exptime: number, allRoleUsers: Set<any>, role: any, copyRoleUsers: Set<any>){
     //   console.log("running timeout");
        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('attend')
                    .setLabel(`I'm here!`)
                    .setStyle('PRIMARY'),
            );
        
        msgToHold = await interaction.channel!.send({ content: `Click here to mark yourself present! \n <@&${role.id}>`, components: [row] });
    
        setTimeout(() => {
            const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('attend')
                    .setLabel(`Expired`)
                    .setStyle('DANGER')
                    .setDisabled(true),
            );
            msgToHold.edit({ content: `You were too late! \n <@&${role.id}>`, components: [row] });
    
        },exptime*60*1000);
    
        const filter = (i: Discord.ButtonInteraction) => i.customId === 'attend';
    
        const collector: Discord.InteractionCollector<Discord.ButtonInteraction> = interaction.channel!.createMessageComponentCollector(
            { filter, time: exptime*60*1000 }
            );
        
        collector.on('collect', async (i: Discord.ButtonInteraction) => {
            //console.log(marked);
            if (i.customId == 'attend'){
                i.deferUpdate();
                if (!allRoleUsers.has(interaction.member)){
                    i.followUp({content: "You aren't a student! Get out!", ephemeral: true});
                } else {
                if (!marked.has(i.member!.user.id)){
                    i.followUp({content: `Marked you here! You earned a point!`, ephemeral:true});
                    marked.set(i.member!.user.id,false);
                    copyRoleUsers.delete(i.member);
                    db.set(`${i.member!.user.id}.points`,db.get(`${i.member!.user.id}.points`)+1);
                }
                else if (!marked.get(i.member!.user.id)){
                    i.followUp({content: `You have already been marked!`, ephemeral:true});
                    marked.set(i.member!.user.id,true);
                }
            }
        }
            
        });
    
        collector.on('end', async () => {
            const ailunicEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Absent Students!')
            .setDescription('These people did not mark themselves present!')
            .setThumbnail('https://i.pinimg.com/originals/80/fd/eb/80fdeb47d44130603f5a2e440c421a66.jpg');

            copyRoleUsers.forEach((member: Discord.GuildMember) => {
                ailunicEmbed.addField(`${member.displayName}#${member.user.discriminator}`, 'zooman alert: h1gh priority!');
            })
            ailunicEmbed.setTimestamp()
            .setFooter('im h1gh', 'https://i.pinimg.com/originals/80/fd/eb/80fdeb47d44130603f5a2e440c421a66.jpg');


            const channel: Discord.TextChannel = interaction.guild?.channels.cache.find((channel) => channel.name == 'teacher') as Discord.TextChannel;
            channel.send({embeds: [ailunicEmbed]});
        }
        );
        }
}

