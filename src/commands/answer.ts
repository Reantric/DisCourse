import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
const { SlashCommandBuilder } = require('@discordjs/builders');
import * as db from "quick.db";
var questions = new db.table('qs');
var helpid = 0;

export default class answer implements IBotInteraction {

    name(): string {
        return "answer";
    }

    help(): string {
        return "answer";
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

async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {
    const marked: Discord.Collection<string,boolean> = new Discord.Collection();
    let msgToHold: Discord.Message;
    let allRoleUsers: Set<Discord.GuildMember> = new Set();
        await interaction.guild!.members.fetch();
        let role = interaction.guild!.roles.cache.find((role: Discord.Role) => role.name == 'Student') as Discord.Role;
        interaction.guild!.members.cache.forEach((v: Discord.GuildMember) => {
            if (v.roles.cache.has(role!.id)){
                allRoleUsers.add(v);
            }
        });
    
    let id:string = interaction.options.getInteger("id").toString();
    let aid = helpid;
    let transfer:any;
    helpid++;
    if(questions.has(interaction.options.getInteger("id").toString())){
        let info = questions.get(id);
        interaction.reply({content:"Your answer has been sent.",ephemeral:true})
        interaction.channel.messages.fetch(info[0])
            .then((msg:any) => {
                const question = msg.embeds[0].fields[0].name;
                transfer = question;
                const answer = new Discord.MessageEmbed();
                answer.setTitle("A classmate answered your question!")
                .setColor("RANDOM")
                .setDescription(`Answered by: ${interaction.member.displayName} #${interaction.member.user.discriminator}`)
                .setThumbnail(interaction.member.user.displayAvatarURL)
                .addField(question,interaction.options.getString('answer'))
                .setFooter(`Question ID: ${id}`)
                .setTimestamp();
                const row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`help${aid.toString()}`)
                        .setLabel(`Helpful`)
                        .setStyle('SUCCESS'),
                );
                msg.reply({content:"This is the original question."});
                interaction.channel!.send({content:`<@${info[1]}>`,embeds:[answer], components:[row]}).then((message:any)=>{
                    msgToHold = message;
                });
    });
    }
    else{
        interaction.reply({content:"We couldn't find that question. You should be in the same channel to answer a question!",ephemeral:true});
    }
    const filter = (i: Discord.ButtonInteraction) => i.customId === `help${aid.toString()}`;
    
    const collector: Discord.InteractionCollector<Discord.ButtonInteraction> = interaction.channel!.createMessageComponentCollector(
        { filter, time: 20*1000 } //2d
        );
    let ptsEarned=0;
    setTimeout(() => {
        const row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setCustomId(`help${aid.toString()}`)
                .setLabel(`Expired`)
                .setStyle('DANGER')
                .setDisabled(true),
        );
        msgToHold.edit({components: [row]});

    },20*1000);//2d

    collector.on('collect', async (i: Discord.ButtonInteraction) => {
        //console.log(marked);
        if (i.customId === `help${aid.toString()}`){
            i.deferUpdate();
            if (!(i.member as Discord.GuildMember).roles.cache.has(role.id)){
                i.followUp({content: "You aren't a student, so this interaction was not saved.", ephemeral: true});
            } else {
            if (!marked.has(i.member!.user.id)){
                i.followUp({content: `Thanks for your feedback!`, ephemeral:true});
                marked.set(i.member!.user.id,false);
                allRoleUsers.delete(i.member as Discord.GuildMember);
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

        const embed = new Discord.MessageEmbed()
        .setColor("#57F287")
        .setTitle('Response Summary!')
        .setDescription('Thanks for taking the time to answer this question!')
        .addField(transfer,interaction.options.getString('answer'))

        embed.setTimestamp()
        .setFooter(`You earned: ${ptsEarned} POINTS`);
        interaction.user.send({embeds: [embed]});
    }
    );
    }
}
