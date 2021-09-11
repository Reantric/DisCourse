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
class mcq {
    name() {
        return "mcq";
    }
    help() {
        return "Make a multiple-choice question for your students.";
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
            let msgToHold;
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
                .setDescription("Students, please answer the following question your teacher has asked.")
                .setColor('YELLOW');
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
                                i.followUp({ content: `You are correct! You received ${points} POINTS.`, ephemeral: true });
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
                for (let j = 0; j < Object.keys(responses).length; j++) {
                    let nickname = `${responses[allRoleUsers[j].user.id][0].displayName} #${responses[allRoleUsers[j].user.id][0].user.discriminator}`;
                    if (responses[allRoleUsers[j].user.id][1] === "r") {
                        correcters += `${nickname}\n`;
                    }
                    else {
                        if (responses[allRoleUsers[j].user.id][1] === null) {
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
                    .setColor('WHITE')
                    .setTitle('Multiple-Choice Question Results')
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWNxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL21jcS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFzQztBQUV0QywrQkFBK0I7QUFDL0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBRS9ELE1BQXFCLEdBQUc7SUFFcEIsSUFBSTtRQUNBLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyxvREFBb0QsQ0FBQztJQUNoRSxDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUNELGlCQUFpQixDQUFDLE9BQWU7UUFDN0IsT0FBTyxPQUFPLEtBQUssS0FBSyxDQUFDO0lBQzdCLENBQUM7SUFDRCxJQUFJO1FBQ0EsT0FBTyxJQUFJLG1CQUFtQixFQUFFO2FBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDcEIsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUMzQixlQUFlLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsY0FBYyxDQUFDLDBDQUEwQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3hJLGdCQUFnQixDQUFDLENBQUMsTUFBVSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDM0csZ0JBQWdCLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxP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