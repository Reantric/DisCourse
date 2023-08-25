const { QuickDB } = require("quick.db");
const db = new QuickDB();
import { IBotInteraction } from "../api/capi";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, Client, Collection, CommandInteraction, ComponentType, EmbedBuilder, GuildMember, InteractionCollector, Message, Role, TextChannel } from "discord.js";
const { SlashCommandBuilder } = require('@discordjs/builders');

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

    perms(): "teacher" | "student" | "both" {
       return 'teacher';
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
                .setDescription('The amount of minutes attendance is valid for!'));
    }

    async runCommand(interaction: CommandInteraction, Bot: Client): Promise<void> { // TODO: exptime is in seconds, change to minutes later
        let allRoleUsers: Set<GuildMember> = new Set();
        await interaction.guild!.members.fetch();
        let role = interaction.guild!.roles.cache.find((role: Role) => role.name == 'Student') as Role;
        interaction.guild!.members.cache.forEach((v: GuildMember) => {
            if (v.roles.cache.has(role!.id)){
                allRoleUsers.add(v);
            }
        });
        
        if (!interaction.isChatInputCommand()) return;
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
            this.collect(Bot,interaction,exptime,allRoleUsers, role);
            setInterval(this.collect, 24*60*60*1000, Bot, interaction, exptime, allRoleUsers, role);
        }, ms)
        
    }

    async collect(Bot: Client, interaction: CommandInteraction, exptime: number, allRoleUsers: Set<GuildMember>, role: any){
     //   console.log("running timeout");
        const marked: Collection<string,boolean> = new Collection();
        let msgToHold: Message;
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('attend')
                    .setLabel(`I'm here!`)
                    .setStyle(ButtonStyle.Primary),
            );
        const channel: TextChannel = interaction.guild?.channels.cache.find((channel) => channel.name == 'announcements') as TextChannel;
        msgToHold = await channel.send({ content: `Click here to mark yourself present! \n <@&${role.id}>`, components: [row] });

        const collectorFilter = (i: ButtonInteraction) => i.customId === 'attend';
    
        const collector: InteractionCollector<ButtonInteraction> = channel.createMessageComponentCollector(
            { 
                componentType: ComponentType.Button, 
                filter: collectorFilter, 
                time: exptime*1000 
            }
        );
        
        collector.on('collect', async (i: ButtonInteraction) => {
            if (i.customId == 'attend'){
                i.deferUpdate();
                if (!(i.member as GuildMember).roles.cache.has(role.id)){
                    i.followUp({content: "You aren't a student!", ephemeral: true});
                } else {
                if (!marked.has(i.member!.user.id)){
                    i.followUp({content: `Marked you here! You earned a point!`, ephemeral:true});
                    marked.set(i.member!.user.id,false);
                    allRoleUsers.delete(i.member as GuildMember);
                    await db.set(`${i.member!.user.id}.points`,await db.get(`${i.member!.user.id}.points`)+1);
                }
                else if (!marked.get(i.member!.user.id)){
                    i.followUp({content: `You have already been marked!`, ephemeral:true});
                    marked.set(i.member!.user.id,true);
                }
            }
        }
            
        });
    
        collector.on('end', async () => {
            const map = new Map<string, number>();
            Array.from(allRoleUsers).forEach(async (user: GuildMember) => map.set(user.id, await db.get(`${user.id}.absences`)))
            const sortedUsers = Array.from(allRoleUsers).sort((a, b) => {
                const aAbsences = map.get(a.id) as number;
                const bAbsences = map.get(b.id) as number;
                if (aAbsences > bAbsences)
                    return 1
                else if (bAbsences > aAbsences)
                    return -1
                return 0;
            });

            const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('attend')
                    .setLabel(`Expired`)
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true),
            );
            msgToHold.edit({ content: `You were too late! \n <@&${role.id}>`, components: [row] });

            const ailunicEmbed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('Absent Students!')
            .setDescription('These people did not mark themselves present!')
            .setThumbnail('https://images.pexels.com/photos/963486/pexels-photo-963486.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940');

            allRoleUsers.forEach(async (member: GuildMember) => {
                await db.add(`${member.id}.absences`,1);
                ailunicEmbed.addFields({
                    name: `${member.displayName}#${member.user.discriminator}`, 
                    value: `${await db.get(`${member.id}.absences`)} absence(s)`
                });
            })
            ailunicEmbed.setTimestamp()
            .setFooter({text: 'Attendance Report'});


            const channel: TextChannel = interaction.guild?.channels.cache.find((channel) => channel.name == 'teacher') as TextChannel;
            channel.send({embeds: [ailunicEmbed]});
        }
        );
        }
}

