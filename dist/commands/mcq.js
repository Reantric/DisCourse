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
const db = require("quick.db");
var qid = new db.table('id');
const { SlashCommandBuilder } = require('@discordjs/builders');
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
            .addIntegerOption((option) => option.setName('exptime').setDescription('Hours till expiration:').setRequired(true))
            .addStringOption((option) => option.setName('right-answer').setDescription('Correct answer choice:').setRequired(true))
            .addStringOption((option) => option.setName('wrong-answer1').setDescription('Wrong answer choice 1:').setRequired(true))
            .addStringOption((option) => option.setName('wrong-answer2').setDescription('Wrong answer choice 2:').setRequired(false))
            .addStringOption((option) => option.setName('wrong-answer3').setDescription('Wrong answer choice 3:').setRequired(false))
            .addStringOption((option) => option.setName('wrong-answer4').setDescription('Wrong answer choice 4:').setRequired(false));
    }
    perms() {
        return 'teacher';
    }
    runCommand(interaction, Bot) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = interaction.guild.roles.cache.find((role) => role.name == 'Student');
            const arr = ['right-answer', 'wrong-answer1', 'wrong-answer2', 'wrong-answer3', 'wrong-answer4'];
            let answers = [];
            let labels = ["A", "B", "C", "D", "E"];
            for (let i = 0; i < arr.length; i++) {
                if (interaction.options.get(arr[i]) != null) {
                    if (arr[i] === 'right-answer') {
                        let obj = { label: i, description: interaction.options.getString(arr[i]), value: "r" };
                        answers.push(obj);
                    }
                    else {
                        let obj = { label: i, description: interaction.options.getString(arr[i]), value: `w${i.toString()}` };
                        answers.push(obj);
                    }
                }
            }
            const shuffleArray = (array) => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    const temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            };
            shuffleArray(answers);
            for (let i = 0; i < answers.length; i++) {
                answers[i].label = labels[i];
            }
            var id = qid.get("id");
            id = id.toString();
            qid.set("id", qid.get("id") + 1);
            const row = new Discord.MessageActionRow()
                .addComponents(new Discord.MessageSelectMenu()
                .setCustomId(id)
                .setPlaceholder('Pick an answer!')
                .addOptions(answers));
            interaction.reply({ content: "Creating your question...", ephemeral: true });
            let question = new Discord.MessageEmbed();
            question.setTitle("Multiple-Choice Question")
                .setDescription("Students, please answer the following question your teacher has asked.");
            let answerchoices = 'Select one of the following answers:';
            for (let i = 0; i < answers.length; i++) {
                try {
                    answerchoices += `\n${answers[i].label}. ${answers[i].description}`;
                }
                finally {
                }
            }
            let time = new Date();
            time.setHours(new Date().getHours() + interaction.options.getInteger('exptime'));
            question.addField(interaction.options.getString('question'), answerchoices)
                .addField("Points: ", interaction.options.getInteger('points').toString())
                .setFooter(`This question must be completed by ${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`)
                .setTimestamp();
            msgToHold = yield interaction.channel.send({ embeds: [question], content: `<@&${role.id}>`, components: [row] });
            setTimeout(() => {
                const row = new Discord.MessageActionRow()
                    .addComponents(new Discord.MessageButton()
                    .setCustomId(id)
                    .setLabel(`Finished`)
                    .setStyle('DANGER')
                    .setDisabled(true));
                msgToHold.edit({ content: "You can no longer answer this question.", components: [row] });
            }, interaction.options.getInteger("exptime") * 60 * 1000);
            let allRoleUsers = [];
            let responses = {};
            yield interaction.guild.members.fetch().then((fetchedMembers) => {
                fetchedMembers.forEach((v) => {
                    if (v.roles.cache.some((role) => role.name === 'Student')) {
                        allRoleUsers.push(v);
                        responses[v.id] = [v, null];
                    }
                });
            });
            const filter = (i) => i.customId === id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: interaction.options.getInteger("exptime") * 60 * 1000 });
            var answered = new Discord.Collection();
            collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                if (i.customId == id) {
                    i.deferUpdate();
                    if (!allRoleUsers.some(m => m.id == i.user.id)) {
                        i.followUp({ content: "Your answer was not saved as you are not a student.", ephemeral: true });
                    }
                    else {
                        if (!answered.has(i.member.user.id)) {
                            answered.set(i.member.user.id, false);
                            if (i.values[0] === "r") {
                                const points = interaction.options.getInteger("points");
                                db.set(`${i.member.user.id}.points`, db.get(`${i.member.user.id}.points`) + points);
                                i.followUp({ content: 'You are correct!', ephemeral: true });
                                let member = i.member.user.id;
                                responses[member][1] = "r";
                            }
                            else {
                                i.followUp({ content: 'Sorry, your choice wasn\'t correct!', ephemeral: true });
                                let member = i.member.user.id;
                                responses[member][1] = i.values[0];
                            }
                        }
                        else if (!answered.get(i.member.user.id)) {
                            i.followUp({ content: 'You have already responded to this question!', ephemeral: true });
                            answered.set(i.member.user.id, true);
                        }
                    }
                }
            }));
            collector.on('end', collected => {
                var _a;
                let answermap = {};
                let answerlist = "";
                for (let k = 0; k < answers.length; k++) {
                    answermap[answers[k].value] = [answers[k].label, answers[k].description];
                    answerlist += answermap[answers[k].value][0] + ". " + answermap[answers[k].value][1] + "\n";
                }
                let correcters = "";
                let wrongers = "";
                let wrongAnswers = "";
                for (let k = 1; k < answers.length; k++) {
                    wrongAnswers += answermap[`w${k}`][0] + ", ";
                }
                wrongAnswers = wrongAnswers.substring(0, wrongAnswers.length - 2);
                let noresponders = "";
                for (let j = 0; j < collected.size; j++) {
                    let nickname = `${responses[allRoleUsers[j].user.id][0].displayName} #${responses[allRoleUsers[j].user.id][0].user.discriminator}`;
                    console.log(nickname);
                    if (responses[allRoleUsers[j].user.id][1] === "r") {
                        correcters += `${nickname}\n`;
                    }
                    else {
                        console.log("cr0nge");
                        if (responses[allRoleUsers[j].user.id][1] === null) {
                            console.log("in null");
                            noresponders += `${nickname}\n`;
                        }
                        else {
                            switch (responses[allRoleUsers[j].user.id][1]) {
                                case "w1":
                                    wrongers += `${nickname}: ${answermap["w1"][0]}\n`;
                                    break;
                                case "w2":
                                    wrongers += `${nickname}: ${answermap["w2"][0]}\n`;
                                    break;
                                case "w3":
                                    wrongers += `${nickname}: ${answermap["w3"][0]}\n`;
                                    break;
                                case "w4":
                                    wrongers += `${nickname}: ${answermap["w4"][0]}\n`;
                                    break;
                                default:
                                    console.log(console.error("oh darn!"));
                                    break;
                            }
                        }
                    }
                }
                if (noresponders === "") {
                    noresponders = "Everybody responded!";
                }
                if (wrongers === "") {
                    wrongers = "Nobody got it wrong!";
                }
                if (correcters === "") {
                    correcters = "Nobody got it right!";
                }
                const embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Multiple-Choice Question Summary')
                    .setDescription('Here\'s what your students answered!')
                    .addFields({ name: interaction.options.getString("question"), value: answerlist }, { name: `Correct Answer: ${answermap["r"][0]}`, value: correcters }, { name: `Wrong Answers: ${wrongAnswers}`, value: wrongers }, { name: `Did Not Respond:`, value: noresponders })
                    .setTimestamp()
                    .setFooter(`Question ID: ${id}`);
                const channel = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.find((channel) => channel.name == 'teacher');
                channel.send({ embeds: [embed] });
            });
        });
    }
}
exports.default = mcq;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWNxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL21jcS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFzQztBQUV0QywrQkFBK0I7QUFDL0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQy9ELElBQUksU0FBMEIsQ0FBQztBQUUvQixNQUFxQixHQUFHO0lBRXBCLElBQUk7UUFDQSxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sbURBQW1ELENBQUM7SUFDL0QsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxPQUFlO1FBQzdCLE9BQU8sT0FBTyxLQUFLLEtBQUssQ0FBQztJQUM3QixDQUFDO0lBQ0QsSUFBSTtRQUNBLE9BQU8sSUFBSSxtQkFBbUIsRUFBRTthQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDM0IsZUFBZSxDQUFDLENBQUMsTUFBVSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLGNBQWMsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN4SSxnQkFBZ0IsQ0FBQyxDQUFDLE1BQVUsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzNHLGdCQUFnQixDQUFDLENBQUMsTUFBVSxFQUFF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