"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require("quick.db");
var questions = new db.table('qs');
var helpid = 0;
class answer {
    name() {
        return "answer";
    }
    help() {
        return "answer";
    }
    cooldown() {
        return 600;
    }
    isThisInteraction(command) {
        return command === "answer";
    }
    data() {
        return new SlashCommandBuilder()
            .setName(this.name())
            .setDescription(this.help())
            .addIntegerOption((option) => option.setName('id').setDescription('Enter the id of the question you want to respond to:').setRequired(true))
            .addStringOption((option) => option.setName('answer').setDescription('Enter the id of the question you want to respond to:').setRequired(true));
    }
    perms() {
        return 'student';
    }
    runCommand(interaction, Bot) {
        return __awaiter(this, void 0, void 0, function* () {
            const marked = new Discord.Collection();
            let msgToHold;
            let allRoleUsers = new Set();
            yield interaction.guild.members.fetch();
            let role = interaction.guild.roles.cache.find((role) => role.name == 'Student');
            interaction.guild.members.cache.forEach((v) => {
                if (v.roles.cache.has(role.id)) {
                    allRoleUsers.add(v);
                }
            });
            let id = interaction.options.getInteger("id").toString();
            let aid = helpid;
            let transfer;
            helpid++;
            if (questions.has(interaction.options.getInteger("id").toString())) {
                let info = questions.get(id);
                interaction.reply({ content: "Your answer has been sent.", ephemeral: true });
                interaction.channel.messages.fetch(info[0])
                    .then((msg) => {
                    const question = msg.embeds[0].fields[0].name;
                    transfer = question;
                    const answer = new Discord.MessageEmbed();
                    answer.setTitle("A classmate answered your question!")
                        .setColor("RANDOM")
                        .setDescription(`Answered by: ${interaction.member.displayName} #${interaction.member.user.discriminator}`)
                        .setThumbnail(interaction.member.user.displayAvatarURL)
                        .addField(question, interaction.options.getString('answer'))
                        .setFooter(`Question ID: ${id}`)
                        .setTimestamp();
                    const row = new Discord.MessageActionRow()
                        .addComponents(new Discord.MessageButton()
                        .setCustomId(`help${aid.toString()}`)
                        .setLabel(`Helpful`)
                        .setStyle('SUCCESS'));
                    msg.reply({ content: "This is the original question." });
                    interaction.channel.send({ content: `<@${info[1]}>`, embeds: [answer], components: [row] }).then((message) => {
                        msgToHold = message;
                    });
                });
            }
            else {
                interaction.reply({ content: "We couldn't find that question. You should be in the same channel to answer a question!", ephemeral: true });
            }
            const filter = (i) => i.customId === `help${aid.toString()}`;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 2 * 24 * 60 * 60 * 1000 });
            let ptsEarned = 0;
            setTimeout(() => {
                const row = new Discord.MessageActionRow()
                    .addComponents(new Discord.MessageButton()
                    .setCustomId(`help${aid.toString()}`)
                    .setLabel(`Expired`)
                    .setStyle('DANGER')
                    .setDisabled(true));
                msgToHold.edit({ components: [row] });
            }, 2 * 24 * 60 * 60 * 1000);
            collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                if (i.customId === `help${aid.toString()}`) {
                    i.deferUpdate();
                    if (!i.member.roles.cache.has(role.id)) {
                        i.followUp({ content: "You aren't a student, so this interaction was not saved.", ephemeral: true });
                    }
                    else {
                        if (!marked.has(i.member.user.id)) {
                            i.followUp({ content: `Thanks for your feedback!`, ephemeral: true });
                            marked.set(i.member.user.id, false);
                            allRoleUsers.delete(i.member);
                            db.set(`${i.member.user.id}.points`, db.get(`${i.member.user.id}.points`) + 1);
                            ptsEarned++;
                        }
                        else if (!marked.get(i.member.user.id)) {
                            i.followUp({ content: `You have already used this button.`, ephemeral: true });
                            marked.set(i.member.user.id, true);
                        }
                    }
                }
            }));
            collector.on('end', () => __awaiter(this, void 0, void 0, function* () {
                const embed = new Discord.MessageEmbed()
                    .setColor("#57F287")
                    .setTitle('Response Summary!')
                    .setDescription('Thanks for taking the time to answer this question!')
                    .addField(transfer, interaction.options.getString('answer'));
                embed.setTimestamp()
                    .setFooter(`You earned: ${ptsEarned} POINTS`);
                interaction.user.send({ embeds: [embed] });
            }));
        });
    }
}
exports.default = answer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zd2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2Fuc3dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFzQztBQUV0QyxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUMvRCwrQkFBK0I7QUFDL0IsSUFBSSxTQUFTLEdBQUcsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25DLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQUVmLE1BQXFCLE1BQU07SUFFdkIsSUFBSTtRQUNBLE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxPQUFlO1FBQzdCLE9BQU8sT0FBTyxLQUFLLFFBQVEsQ0FBQztJQUNoQyxDQUFDO0lBQ0QsSUFBSTtRQUNKLE9BQU8sSUFBSSxtQkFBbUIsRUFBRTthQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDM0IsZ0JBQWdCLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLHNEQUFzRCxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQy9JLGVBQWUsQ0FBQyxDQUFDLE1BQVUsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxjQUFjLENBQUMsc0RBQXNELENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUN2SixDQUFDO0lB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