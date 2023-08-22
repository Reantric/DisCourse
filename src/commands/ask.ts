import { Client, Role } from "discord.js";
import { EmbedBuilder } from "discord.js";
import { IBotInteraction } from "../api/capi";
const { SlashCommandBuilder } = require('@discordjs/builders');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

var questionId = db.table('id');
var questionInfo = new db.table('qs');

export default class ask implements IBotInteraction {

    name(): string {
        return "ask";
    }

    help(): string {
        return "Students can ask their own questions!";
    }   
    
    cooldown(): number{
        return 600;
    }

    isThisInteraction(command: string): boolean {
        return command === "ask";
    }

    data(): any {
        const commandBuilder = new SlashCommandBuilder();
        commandBuilder.setName(this.name());
        commandBuilder.setDescription(this.help());
        commandBuilder.addStringOption({
            name: 'question',
            description: 'Enter your question: ',
            setRequired: true
        });
        return commandBuilder
    }

    perms(): "teacher" | "student" | "both" {
        return "student";
    }

    async runCommand(interaction: any, Bot: Client): Promise<void> {
        var id = questionId.get("id");
        id = id.toString();
        questionId.set("id", questionId.get("id") + 1);
        let role = interaction.guild!.roles.cache.find((role: Role) => role.name == 'Student') as Role;
        const question = new EmbedBuilder();
        question.setTitle("Your classmate has a question!")
        .setColor('Random')
        .setDescription(`Asked by: ${interaction.member.displayName} #${interaction.member.user.discriminator}`)
        .setThumbnail(interaction.member.user.displayAvatarURL)
        .addFields(interaction.options.getString('question'),`Respond to this question using /answer with this question ID to have an opportunity to earn points!`)
        .setFooter({text: `Question ID: ${id}`})
        .setTimestamp();
        let msgid = "";
        interaction.channel.send({content:`<@&${role!.id}>`,embeds:[question]}).then((message:any) => {
            msgid = message.id;
            questionInfo.set(id,[msgid,interaction.member.user.id]);
        }).catch((error:Error) => console.log(error));
        interaction.reply({content:`Your question was sent!`, ephemeral: true});
    }
}