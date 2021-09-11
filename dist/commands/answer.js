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
        return "Answer another student's question using the respective question ID to get points.";
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
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 20 * 1000 });
            let ptsEarned = 0;
            setTimeout(() => {
                const row = new Discord.MessageActionRow()
                    .addComponents(new Discord.MessageButton()
                    .setCustomId(`help${aid.toString()}`)
                    .setLabel(`Expired`)
                    .setStyle('DANGER')
                    .setDisabled(true));
                msgToHold.edit({ components: [row] });
            }, 20 * 1000);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zd2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2Fuc3dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFzQztBQUV0QyxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUMvRCwrQkFBK0I7QUFDL0IsSUFBSSxTQUFTLEdBQUcsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25DLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQUVmLE1BQXFCLE1BQU07SUFFdkIsSUFBSTtRQUNBLE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyxtRkFBbUYsQ0FBQztJQUMvRixDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUNELGlCQUFpQixDQUFDLE9BQWU7UUFDN0IsT0FBTyxPQUFPLEtBQUssUUFBUSxDQUFDO0lBQ2hDLENBQUM7SUFDRCxJQUFJO1FBQ0osT0FBTyxJQUFJLG1CQUFtQixFQUFFO2FBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDcEIsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUMzQixnQkFBZ0IsQ0FBQyxDQUFDLE1BQVUsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsc0RBQXNELENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDL0ksZUFBZSxDQUFDLENBQUMsTUFBVSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxzREFBc0QsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBQ3ZKLENBQUM7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