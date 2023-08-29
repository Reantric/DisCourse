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
const discord_js_1 = require("discord.js");
const discord_js_2 = require("discord.js");
const discord_js_3 = require("discord.js");
const discord_js_4 = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
var questionInfo = db.table('qs');
var helpId = 0;
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
            const marked = new discord_js_1.Collection();
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
            let aid = helpId;
            let transfer;
            helpId++;
            if (yield questionInfo.has(interaction.options.getInteger("id").toString())) {
                let info = yield questionInfo.get(id);
                interaction.reply({ content: "Your answer has been sent.", ephemeral: true });
                interaction.channel.messages.fetch(info[0])
                    .then((msg) => {
                    const question = msg.embeds[0].fields[0].name;
                    transfer = question;
                    const answer = new discord_js_2.EmbedBuilder();
                    answer.setTitle("A classmate answered your question!")
                        .setColor("Random")
                        .setDescription(`Answered by: ${interaction.member.displayName} #${interaction.member.user.discriminator}`)
                        .setThumbnail(interaction.member.user.displayAvatarURL)
                        .addFields(question, interaction.options.getString('answer'))
                        .setFooter({ text: `Question ID: ${id}` })
                        .setTimestamp();
                    const row = new discord_js_3.ActionRowBuilder()
                        .addComponents(new discord_js_3.ButtonBuilder()
                        .setCustomId(`help${aid.toString()}`)
                        .setLabel(`Helpful`)
                        .setStyle(discord_js_4.ButtonStyle.Success));
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
                const row = new discord_js_3.ActionRowBuilder()
                    .addComponents(new discord_js_3.ButtonBuilder()
                    .setCustomId(`help${aid.toString()}`)
                    .setLabel(`Expired`)
                    .setStyle(discord_js_4.ButtonStyle.Danger)
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
                const embed = new discord_js_2.EmbedBuilder()
                    .setColor("#57F287")
                    .setTitle('Response Summary!')
                    .setDescription('Thanks for taking the time to answer this question!')
                    .addFields(transfer, interaction.options.getString('answer'))
                    .setTimestamp()
                    .setFooter({ text: `You earned: **${ptsEarned}** points` });
                interaction.user.send({ embeds: [embed] });
            }));
        });
    }
}
exports.default = answer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zd2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2Fuc3dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLDJDQUE0RTtBQUU1RSwyQ0FBMEM7QUFDMUMsMkNBQTZEO0FBQzdELDJDQUF5QztBQUd6QyxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUUvRCxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hDLE1BQU0sRUFBRSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFFekIsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsQyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFFZixNQUFxQixNQUFNO0lBRXZCLElBQUk7UUFDQSxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sbUZBQW1GLENBQUM7SUFDL0YsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxPQUFlO1FBQzdCLE9BQU8sT0FBTyxLQUFLLFFBQVEsQ0FBQztJQUNoQyxDQUFDO0lBQ0QsSUFBSTtRQUNKLE9BQU8sSUFBSSxtQkFBbUIsRUFBRTthQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDM0IsZ0JBQWdCLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLHNEQUFzRCxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQy9JLGVBQWUsQ0FBQyxDQUFDLE1BQVUs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