import { Client, Role, Message, Collection, GuildMember } from "discord.js";
import { ButtonInteraction, InteractionCollector } from "discord.js";
import { EmbedBuilder } from "discord.js";
import { ActionRowBuilder, ButtonBuilder } from "discord.js";
import { ButtonStyle } from "discord.js";
import { IBotInteraction } from "../api/capi";
const { SlashCommandBuilder } = require('@discordjs/builders');

const { QuickDB } = require("quick.db");
const db = new QuickDB();

var questionInfo = db.table('qs');
var helpId = 0;

export default class answer implements IBotInteraction {

    name(): string {
        return "answer";
    }

    help(): string {
        return "Answer another student's question using the respective question ID to get points.";
    }   
    
    cooldown(): number{
        return 600;
    }
    isThisInteraction(command: string): boolean {
        return command === "answer";
    }
    data(): any {
    return new SlashCommandBuilder()
    .setName(this.name())
    .setDescription(this.help())
    .addIntegerOption((option:any) => option.setName('id').setDescription('Enter the id of the question you want to respond to:').setRequired(true))
    .addStringOption((option:any) => option.setName('answer').setDescription('Enter the id of the question you want to respond to:').setRequired(true))
}
perms(): "teacher" | "student" | "both" {
    return 'student';
 }

async runCommand(interaction: any, Bot: Client): Promise<void> {
    const marked: Collection<string,boolean> = new Collection();
    let msgToHold: Message;
    let allRoleUsers: Set<GuildMember> = new Set();
        await interaction.guild!.members.fetch();
        let role = interaction.guild!.roles.cache.find((role: Role) => role.name == 'Student') as Role;
        interaction.guild!.members.cache.forEach((v: GuildMember) => {
            if (v.roles.cache.has(role!.id)){
                allRoleUsers.add(v);
            }
        });
    
    let id: string = interaction.options.getInteger("id").toString();
    let aid = helpId;
    let transfer:any;
    helpId++;
    if(questionInfo.has(interaction.options.getInteger("id").toString())){
        let info = questionInfo.get(id);
        interaction.reply({content:"Your answer has been sent.",ephemeral:true})
        interaction.channel.messages.fetch(info[0])
        .then((msg:any) => {
            const question = msg.embeds[0].fields[0].name;
            transfer = question;
            const answer = new EmbedBuilder();
            answer.setTitle("A classmate answered your question!")
            .setColor("Random")
            .setDescription(`Answered by: ${interaction.member.displayName} #${interaction.member.user.discriminator}`)
            .setThumbnail(interaction.member.user.displayAvatarURL)
            .addFields(question,interaction.options.getString('answer'))
            .setFooter({text: `Question ID: ${id}`})
            .setTimestamp();
            const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`help${aid.toString()}`)
                .setLabel(`Helpful`)
                .setStyle(ButtonStyle.Success)
            );
            msg.reply({content:"This is the original question."});
            interaction.channel!.send({content:`<@${info[1]}>`,embeds:[answer], components:[row]}).then((message:any)=>{
                msgToHold = message;
            });
        });
    } else {
        interaction.reply({content:"We couldn't find that question. You should be in the same channel to answer a question!",ephemeral:true});
    }
    const filter = (i: ButtonInteraction) => i.customId === `help${aid.toString()}`;
    
    const collector: InteractionCollector<ButtonInteraction> = interaction.channel!.createMessageComponentCollector(
        { filter, time: 20*1000 } //2d
        );
    let ptsEarned=0;
    setTimeout(() => {
        const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`help${aid.toString()}`)
            .setLabel(`Expired`)
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true)
        );
        msgToHold.edit({components: [row]});

    }, 20*1000);//2d

    collector.on('collect', async (i: ButtonInteraction) => {
        if (i.customId === `help${aid.toString()}`){
            i.deferUpdate();
            if (!(i.member as GuildMember).roles.cache.has(role.id)){
                i.followUp({content: "You aren't a student, so this interaction was not saved.", ephemeral: true});
            } else {
            if (!marked.has(i.member!.user.id)){
                i.followUp({content: `Thanks for your feedback!`, ephemeral:true});
                marked.set(i.member!.user.id,false);
                allRoleUsers.delete(i.member as GuildMember);
                db.set(`${i.member!.user.id}.points`,db.get(`${i.member!.user.id}.points`)+1);
                ptsEarned++;
            }
            else if (!marked.get(i.member!.user.id)){
                i.followUp({content: `You have already used this button.`, ephemeral:true});
                marked.set(i.member!.user.id,true);
            }
        }
    }
        
    });

    collector.on('end', async () => {
        const embed = new EmbedBuilder()
        .setColor("#57F287")
        .setTitle('Response Summary!')
        .setDescription('Thanks for taking the time to answer this question!')
        .addFields(transfer,interaction.options.getString('answer'))
        .setTimestamp()
        .setFooter({text: `You earned: **${ptsEarned}** points`});
        interaction.user.send({embeds: [embed]});
    });
    }
}
