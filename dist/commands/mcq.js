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
const marked = new Discord.Collection();
let msgToHold;
class mcq {
    name() {
        return "mcq";
    }
    help() {
        return "Make a multiple-choice question for your students";
    }
    cooldown() {
        return 2;
    }
    isThisInteraction(command) {
        return command === "mcq";
    }
    data() {
        return new SlashCommandBuilder()
            .setName(this.name())
            .setDescription(this.help())
            .addStringOption((option) => option.setName('question').setDescription('Enter your question (just the question):').setRequired(true))
            .addIntegerOption((option) => option.setName('points').setDescription('Point value:').setRequired(true))
            .addIntegerOption((option) => option.setName('exptime').setDescription('Minutes till expiration:').setRequired(true))
            .addStringOption((option) => option.setName('right-answer').setDescription('Correct answer choice:').setRequired(true))
            .addStringOption((option) => option.setName('wrong-answer1').setDescription('Wrong answer choice 1:').setRequired(true))
            .addStringOption((option) => option.setName('wrong-answer2').setDescription('Wrong answer choice 2:').setRequired(false))
            .addStringOption((option) => option.setName('wrong-answer3').setDescription('Wrong answer choice 3:').setRequired(false))
            .addStringOption((option) => option.setName('wrong-answer4').setDescription('Wrong answer choice 4:').setRequired(false));
    }
    runCommand(interaction, Bot) {
        return __awaiter(this, void 0, void 0, function* () {
            const arr = ['right-answer', 'wrong-answer1', 'wrong-answer2', 'wrong-answer3', 'wrong-answer4'];
            let answers = [];
            let labels = ["A", "B", "C", "D", "E"];
            for (let i = 0; i < arr.length; i++) {
                if (interaction.options.get(arr[i]) != null) {
                    if (arr[i] === 'right-answer') {
                        let obj = { label: i, description: interaction.options.getString(arr[i]), value: "r" };
                        let randIn = Math.floor(Math.random() * answers.length);
                        answers.splice(randIn, 0, obj);
                    }
                    else {
                        let obj = { label: i, description: interaction.options.getString(arr[i]), value: "w" };
                        let randIn = Math.floor(Math.random() * answers.length);
                        answers.splice(randIn, 0, obj);
                    }
                }
            }
            for (let i = 0; i < answers.length; i++) {
                answers[i].label = labels[i];
            }
            var id = "select";
            const row = new Discord.MessageActionRow()
                .addComponents(new Discord.MessageSelectMenu()
                .setCustomId(id)
                .setPlaceholder('Pick an answer!')
                .addOptions(answers));
            interaction.reply({ content: "Creating your question..." });
            msgToHold = yield interaction.channel.send({ content: interaction.options.getString('question'), components: [row] });
            setTimeout(() => {
                const row = new Discord.MessageActionRow()
                    .addComponents(new Discord.MessageButton()
                    .setCustomId('attend')
                    .setLabel(`Finished`)
                    .setStyle('DANGER')
                    .setDisabled(true));
                msgToHold.edit({ content: "You can no longer answer this question.", components: [row] });
            }, interaction.options.getInteger("exptime") * 60 * 1000);
            let allRoleUsers = new Set();
            yield interaction.guild.members.fetch();
            interaction.guild.members.cache.forEach((v) => {
                if (v.roles.cache.some((role) => role.name === 'Student'))
                    allRoleUsers.add(v);
            });
            const filter = (i) => i.customId === id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: interaction.options.getInteger("exptime") * 60 * 1000 });
            var answered = new Discord.Collection();
            collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                if (i.customId == id) {
                    i.deferUpdate();
                    if (!allRoleUsers.has(interaction.member)) {
                        i.followUp({ content: "Your answer was not saved as you are not a student.", ephemeral: true });
                    }
                    else {
                        if (!answered.has(i.member.user.id)) {
                            i.followUp({ content: 'Thank you for your response!', ephemeral: true });
                            answered.set(i.member.user.id, false);
                            allRoleUsers.delete(i.member);
                        }
                        else if (!answered.get(i.member.user.id)) {
                            i.followUp({ content: 'You have already responded to this question!', ephemeral: true });
                            answered.set(i.member.user.id, true);
                        }
                    }
                }
            }));
            collector.on('end', collected => {
                console.log(`Collected ${collected.size} items`);
            });
        });
    }
}
exports.default = mcq;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWNxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL21jcS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFzQztBQUd0QyxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUMvRCxNQUFNLE1BQU0sR0FBdUMsSUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDNUUsSUFBSSxTQUEwQixDQUFDO0FBRS9CLE1BQXFCLEdBQUc7SUFFcEIsSUFBSTtRQUNBLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyxtREFBbUQsQ0FBQztJQUMvRCxDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUNELGlCQUFpQixDQUFDLE9BQWU7UUFDN0IsT0FBTyxPQUFPLEtBQUssS0FBSyxDQUFDO0lBQzdCLENBQUM7SUFDRCxJQUFJO1FBQ0EsT0FBTyxJQUFJLG1CQUFtQixFQUFFO2FBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDcEIsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUMzQixlQUFlLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsY0FBYyxDQUFDLDBDQUEwQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3hJLGdCQUFnQixDQUFDLENBQUMsTUFBVSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDM0csZ0JBQWdCLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxP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