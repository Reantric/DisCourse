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
            if (questionInfo.has(interaction.options.getInteger("id").toString())) {
                let info = questionInfo.get(id);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5zd2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2Fuc3dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLDJDQUE0RTtBQUU1RSwyQ0FBMEM7QUFDMUMsMkNBQTZEO0FBQzdELDJDQUF5QztBQUV6QyxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUUvRCxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hDLE1BQU0sRUFBRSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFFekIsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsQyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFFZixNQUFxQixNQUFNO0lBRXZCLElBQUk7UUFDQSxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sbUZBQW1GLENBQUM7SUFDL0YsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxPQUFlO1FBQzdCLE9BQU8sT0FBTyxLQUFLLFFBQVEsQ0FBQztJQUNoQyxDQUFDO0lBQ0QsSUFBSTtRQUNKLE9BQU8sSUFBSSxtQkFBbUIsRUFBRTthQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDM0IsZ0JBQWdCLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLHNEQUFzRCxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQy9JLGVBQWUsQ0FBQyxDQUFDLE1BQVUsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxjQUFjLENBQUMsc0RBQXNELENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUN2SixDQUFDO0lBQ0QsS0FBSztRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ3BCLENBQUM7SUFFSSxVQUFVLENBQUMsV0FBZ0IsRUFBRSxHQUFXOztZQUMxQyxNQUFNLE1BQU0sR0FBK0IsSUFBSSx1QkFBVSxFQUFFLENBQUM7WUFDNUQsSUFBSSxTQUFrQixDQUFDO1lBQ3ZCLElBQUksWUFBWSxHQUFxQixJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQzNDLE1BQU0sV0FBVyxDQUFDLEtBQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDekMsSUFBSSxJQUFJLEdBQUcsV0FBVyxDQUFDLEtBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQVUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxTQUFTLENBQVMsQ0FBQztZQUMvRixXQUFXLENBQUMsS0FBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBYyxFQUFFLEVBQUU7Z0JBQ3hELElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUssQ0FBQyxFQUFFLENBQUMsRUFBQztvQkFDNUIsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDdkI7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVQLElBQUksRUFBRSxHQUFXLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2pFLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQztZQUNqQixJQUFJLFFBQVksQ0FBQztZQUNqQixNQUFNLEVBQUUsQ0FBQztZQUNULElBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFDO2dCQUNqRSxJQUFJLElBQUksR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNoQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFDLDRCQUE0QixFQUFDLFNBQVMsRUFBQyxJQUFJLEVBQUMsQ0FBQyxDQUFBO2dCQUN4RSxXQUFXLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUMxQyxJQUFJLENBQUMsQ0FBQyxHQUFPLEVBQUUsRUFBRTtvQkFDZCxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7b0JBQzlDLFFBQVEsR0FBRyxRQUFRLENBQUM7b0JBQ3BCLE1BQU0sTUFBTSxHQUFHLElBQUkseUJBQVksRUFBRSxDQUFDO29CQUNsQyxNQUFNLENBQUMsUUFBUSxDQUFDLHFDQUFxQyxDQUFDO3lCQUNyRCxRQUFRLENBQUMsUUFBUSxDQUFDO3lCQUNsQixjQUFjLENBQUMsZ0JBQWdCLFdBQVcsQ0FBQyxNQUFNLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO3lCQUMxRyxZQUFZLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7eUJBQ3RELFNBQVMsQ0FBQyxRQUFRLEVBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7eUJBQzNELFNBQVMsQ0FBQyxFQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLEVBQUMsQ0FBQzt5QkFDdkMsWUFBWSxFQUFFLENBQUM7b0JBQ2hCLE1BQU0sR0FBRyxHQUFHLElBQUksNkJBQWdCLEVBQWlCO3lCQUNoRCxhQUFhLENBQ1YsSUFBSSwwQkFBYSxFQUFFO3lCQUNsQixXQUFXLENBQUMsT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQzt5QkFDcEMsUUFBUSxDQUFDLFNBQVMsQ0FBQzt5QkFDbkIsUUFBUSxDQUFDLHdCQUFXLENBQUMsT0FBTyxDQUFDLENBQ2pDLENBQUM7b0JBQ0YsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBQyxnQ0FBZ0MsRUFBQyxDQUFDLENBQUM7b0JBQ3RELFdBQVcsQ0FBQyxPQUFRLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTyxFQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsTUFBTSxFQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBVSxFQUFDLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQVcsRUFBQyxFQUFFO3dCQUN2RyxTQUFTLEdBQUcsT0FBTyxDQUFDO29CQUN4QixDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLENBQUMsQ0FBQzthQUNOO2lCQUFNO2dCQUNILFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUMseUZBQXlGLEVBQUMsU0FBUyxFQUFDLElBQUksRUFBQyxDQUFDLENBQUM7YUFDekk7WUFDRCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQW9CLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEtBQUssT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztZQUVoRixNQUFNLFNBQVMsR0FBNEMsV0FBVyxDQUFDLE9BQVEsQ0FBQywrQkFBK0IsQ0FDM0csRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsR0FBQyxJQUFJLEVBQUUsQ0FDeEIsQ0FBQztZQUNOLElBQUksU0FBUyxHQUFDLENBQUMsQ0FBQztZQUNoQixVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNaLE1BQU0sR0FBRyxHQUFHLElBQUksNkJBQWdCLEVBQWlCO3FCQUNoRCxhQUFhLENBQ1YsSUFBSSwwQkFBYSxFQUFFO3FCQUNsQixXQUFXLENBQUMsT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztxQkFDcEMsUUFBUSxDQUFDLFNBQVMsQ0FBQztxQkFDbkIsUUFBUSxDQUFDLHdCQUFXLENBQUMsTUFBTSxDQUFDO3FCQUM1QixXQUFXLENBQUMsSUFBSSxDQUFDLENBQ3JCLENBQUM7Z0JBQ0YsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFDLFVBQVUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUV4QyxDQUFDLEVBQUUsRUFBRSxHQUFDLElBQUksQ0FBQyxDQUFDO1lBRVosU0FBUyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBTyxDQUFvQixFQUFFLEVBQUU7Z0JBQ25ELElBQUksQ0FBQyxDQUFDLFFBQVEsS0FBSyxPQUFPLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFDO29CQUN2QyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ2hCLElBQUksQ0FBRSxDQUFDLENBQUMsTUFBc0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUM7d0JBQ3BELENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBQyxPQUFPLEVBQUUsMERBQTBELEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7cUJBQ3RHO3lCQUFNO3dCQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFDOzRCQUMvQixDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUMsT0FBTyxFQUFFLDJCQUEyQixFQUFFLFNBQVMsRUFBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDOzRCQUNuRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBQyxLQUFLLENBQUMsQ0FBQzs0QkFDcEMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBcUIsQ0FBQyxDQUFDOzRCQUM3QyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxTQUFTLEVBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzlFLFNBQVMsRUFBRSxDQUFDO3lCQUNmOzZCQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFDOzRCQUNwQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUMsT0FBTyxFQUFFLG9DQUFvQyxFQUFFLFNBQVMsRUFBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDOzRCQUM1RSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBQyxJQUFJLENBQUMsQ0FBQzt5QkFDdEM7cUJBQ0o7aUJBQ0o7WUFFRCxDQUFDLENBQUEsQ0FBQyxDQUFDO1lBRUgsU0FBUyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsR0FBUyxFQUFFO2dCQUMzQixNQUFNLEtBQUssR0FBRyxJQUFJLHlCQUFZLEVBQUU7cUJBQy9CLFFBQVEsQ0FBQyxTQUFTLENBQUM7cUJBQ25CLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQztxQkFDN0IsY0FBYyxDQUFDLHFEQUFxRCxDQUFDO3FCQUNyRSxTQUFTLENBQUMsUUFBUSxFQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3FCQUMzRCxZQUFZLEVBQUU7cUJBQ2QsU0FBUyxDQUFDLEVBQUMsSUFBSSxFQUFFLGlCQUFpQixTQUFTLFdBQVcsRUFBQyxDQUFDLENBQUM7Z0JBQzFELFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQSxDQUFDLENBQUM7UUFDSCxDQUFDO0tBQUE7Q0FDSjtBQTdIRCx5QkE2SEMifQ==