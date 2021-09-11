import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
const { SlashCommandBuilder } = require('@discordjs/builders');
import * as db from "quick.db";
var qid = new db.table('id');
var questioninfo = new db.table('qs');

export default class ask implements IBotInteraction {

    name(): string {
        return "ask";
    }

    help(): string {
        return "ask";
    }   
    
    cooldown(): number{
        return 300;
    }
    isThisInteraction(command: string): boolean {
        return command === "ask";
    }
    data(): any {
    return new SlashCommandBuilder()
    .setName(this.name())
    .setDescription(this.help())
    .addStringOption((option:any) => option.setName('question').setDescription('Enter your question (just the question):').setRequired(true))
}
perms(): "teacher" | "student" | "both" {
    return "student";
 }

async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {
    var id = qid.get("id");
    id = id.toString();
    qid.set("id",qid.get("id")+1);
    let role = interaction.guild!.roles.cache.find((role: Discord.Role) => role.name == 'Student') as Discord.Role;
    const question = new Discord.MessageEmbed();
    question.setTitle("Your classmate has a question!")
    .setDescription(`Asked by: ${interaction.member.displayName} #${interaction.member.user.discriminator}`)
    .addField(interaction.options.getString('question'),`Respond to this question using /replys with this question ID to have an opportunity to earn points!`)
    .setFooter(`Question ID: ${id}`)
    .setTimestamp();
    let msgid = "";
    interaction.channel.send({content:`<@&${role!.id}>`,embeds:[question]}).then((message:any) => {
        msgid = message.id;
        console.log([msgid,interaction.member.user.id])
        questioninfo.set(id,[msgid,interaction.member.user.id]);
    }).catch((error:Error) => console.log(error));
    interaction.reply({content:`Your question was sent!`, ephemeral: true});
}
}