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
const { QuickDB } = require("quick.db");
const db = new QuickDB();
var qid = db.table('id');
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
            const row = new discord_js_2.ActionRowBuilder()
                .addComponents(new discord_js_2.StringSelectMenuBuilder()
                .setCustomId(id)
                .setPlaceholder('Pick an answer!')
                .addOptions(answers));
            interaction.reply({ content: "Creating your question...", ephemeral: true });
            let question = new discord_js_2.EmbedBuilder();
            question.setTitle("Multiple-Choice Question")
                .setDescription("Students, please answer the following question your teacher has asked.")
                .setColor('Yellow');
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
            question.addFields(interaction.options.getString('question'), answerchoices)
                .addFields("Points: ", interaction.options.getInteger('points').toString())
                .setFooter({ text: `This question must be completed by ${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}` })
                .setTimestamp();
            msgToHold = yield interaction.channel.send({ embeds: [question], content: `<@&${role.id}>`, components: [row] });
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
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: interaction.options.getInteger("exptime") * 60 * 60 * 1000 });
            var answered = new discord_js_1.Collection();
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
                                yield db.set(`${i.member.user.id}.points`, (yield db.get(`${i.member.user.id}.points`)) + points);
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
            collector.on('end', () => {
                var _a;
                const row = new discord_js_2.ActionRowBuilder()
                    .addComponents(new discord_js_2.ButtonBuilder()
                    .setCustomId(id)
                    .setLabel(`Finished`)
                    .setStyle(discord_js_2.ButtonStyle.Danger)
                    .setDisabled(true));
                msgToHold.edit({ content: "You can no longer answer this question.", components: [row] });
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
                const embed = new discord_js_2.EmbedBuilder()
                    .setColor('White')
                    .setTitle('Multiple-Choice Question Results')
                    .setDescription('Here\'s what your students answered!')
                    .addFields({ name: interaction.options.getString("question"), value: answerlist }, { name: `Correct Answer: ${answermap["r"][0]}`, value: correcters }, { name: `Wrong Answers: ${wrongAnswers}`, value: wrongers }, { name: `Did Not Respond:`, value: noresponders })
                    .setTimestamp()
                    .setFooter({ text: `Question ID: ${id}` });
                const channel = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.find((channel) => channel.name == 'teacher');
                channel.send({ embeds: [embed] });
            });
        });
    }
}
exports.default = mcq;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWNxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL21jcS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLDJDQUFzSTtBQUV0SSwyQ0FBaUg7QUFFakgsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN4QyxNQUFNLEVBQUUsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQ3pCLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsTUFBTSxFQUFFLG1CQUFtQixFQUFFLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFFL0QsTUFBcUIsR0FBRztJQUVwQixJQUFJO1FBQ0EsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLG9EQUFvRCxDQUFDO0lBQ2hFLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBQ0QsaUJBQWlCLENBQUMsT0FBZTtRQUM3QixPQUFPLE9BQU8sS0FBSyxLQUFLLENBQUM7SUFDN0IsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLElBQUksbUJBQW1CLEVBQUU7YUFDL0IsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNwQixjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQzNCLGVBQWUsQ0FBQyxDQUFDLE1BQVUsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxjQUFjLENBQUMsMENBQTBDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDeEksZ0JBQWdCLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMzRyxnQkFBZ0IsQ0FBQyxDQUFDLE1BQVUsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxjQUFjLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDdEgsZUFBZSxDQUFDLENBQUMsTUFBVSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMxSCxlQUFlLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsY0FBYyxDQUFDLHdCQUF3QixDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzNILGVBQWUsQ0FBQyxDQUFDLE1BQVUsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxjQUFjLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDNUgsZUFBZSxDQUFDLENBQUMsTUFBVSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUM1SCxlQUFlLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsY0FBYyxDQUFDLHdCQUF3QixDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQzVIO0lBQ0wsQ0FBQztJQUNELEtBQUs7UUFDRCxPQUFPLFNBQVMsQ0FBQztJQUNwQixDQUFDO0lBRUEsVUFBVSxDQUFDLFdBQWdCLEVBQUUsR0FBVzs7WUFDMUMsSUFBSSxTQUFrQixDQUFDO1lBRXZCLElBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQyxLQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFVLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFTLENBQUM7WUFDL0YsTUFBTSxHQUFHLEdBQUcsQ0FBQyxjQUFjLEVBQUMsZUFBZSxFQUFDLGVBQWUsRUFBQyxlQUFlLEVBQUMsZUFBZSxDQUFDLENBQUM7WUFDN0YsSUFBSSxPQUFPLEdBQVUsRUFBRSxDQUFDO1lBQ3hCLElBQUksTUFBTSxHQUFHLENBQUMsR0FBRyxFQUFDLEdBQUcsRUFBQyxHQUFHLEVBQUMsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ2xDLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFDO2dCQUMxQixJQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBQztvQkFDdkMsSUFBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUcsY0FBYyxFQUFDO3dCQUN2QixJQUFJLEdBQUcsR0FBRyxFQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUMsQ0FBQzt3QkFDcEYsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDckI7eUJBQ0c7d0JBQ0EsSUFBSSxHQUFHLEdBQUcsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBQyxDQUFDO3dCQUNuRyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUNyQjtpQkFDSjthQUNKO1lBRUQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxLQUFTLEVBQUUsRUFBRTtnQkFDL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUN6QyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QyxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7aUJBQ2pCO1lBQ0gsQ0FBQyxDQUFBO1lBRUgsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXRCLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxPQUFPLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFDO2dCQUM5QixPQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNqQztZQUNELElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTlCLE1BQU0sR0FBRyxHQUFHLElBQUksNkJBQWdCLEVBQUU7aUJBQzdCLGFBQWEsQ0FDVixJQUFJLG9DQUF1QixFQUFFO2lCQUM1QixXQUFXLENBQUMsRUFBRSxDQUFDO2lCQUNmLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQztpQkFDakMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUN2QixDQUFDO1lBQ04sV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxTQUFTLEVBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztZQUMxRSxJQUFJLFFBQVEsR0FBRyxJQUFJLHlCQUFZLEVBQUUsQ0FBQztZQUNsQyxRQUFRLENBQUMsUUFBUSxDQUFDLDBCQUEwQixDQUFDO2lCQUM1QyxjQUFjLENBQUMsd0VBQXdFLENBQUM7aUJBQ3hGLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVwQixJQUFJLGFBQWEsR0FBRyxzQ0FBc0MsQ0FBQztZQUMzRCxLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsT0FBTyxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUUsRUFBQztnQkFDN0IsSUFBRztvQkFDQyxhQUFhLElBQUUsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztpQkFDckU7d0JBQ007aUJBQ047YUFDSjtZQUNELElBQUksSUFBSSxHQUFRLElBQUksSUFBSSxFQUFFLENBQUM7WUFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDL0UsUUFBUSxDQUFDLFNBQVMsQ0FBRSxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRSxhQUFhLENBQUM7aUJBQzVFLFNBQVMsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7aUJBQzFFLFNBQVMsQ0FBQyxFQUFDLElBQUksRUFBRSxzQ0FBc0MsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxDQUFDO2lCQUNySixZQUFZLEVBQUUsQ0FBQztZQUVoQixTQUFTLEdBQUcsTUFBTSxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBQyxDQUFDLFFBQVEsQ0FBQyxFQUFDLE9BQU8sRUFBRSxNQUFNLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFL0csSUFBSSxZQUFZLEdBQVMsRUFBRSxDQUFDO1lBQzVCLElBQUksU0FBUyxHQUFLLEVBQUUsQ0FBQztZQUNyQixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWtCLEVBQUUsRUFBRTtnQkFDaEUsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQWMsRUFBRSxFQUFFO29CQUN0QyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQXVCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLEVBQUM7d0JBQ3pFLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3JCLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLENBQUM7cUJBQzVCO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUE7WUFDRixNQUFNLE1BQU0sR0FBRyxDQUFDLENBQXdCLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEtBQUssRUFBRSxDQUFDO1lBQy9ELE1BQU0sU0FBUyxHQUNYLFdBQVcsQ0FBQyxPQUFRLENBQUMsK0JBQStCLENBQ2hELEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBQyxFQUFFLEdBQUMsRUFBRSxHQUFDLElBQUksRUFBRSxDQUN6RSxDQUFDO1lBR04sSUFBSSxRQUFRLEdBQWdDLElBQUksdUJBQVUsRUFBRSxDQUFDO1lBQzdELFNBQVMsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQU8sQ0FBd0IsRUFBRSxFQUFFO2dCQUN2RCxJQUFJLENBQUMsQ0FBQyxRQUFRLElBQUksRUFBRSxFQUFDO29CQUNqQixDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ2hCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFDO3dCQUMzQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUMsT0FBTyxFQUFFLHFEQUFxRCxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO3FCQUNqRzt5QkFBTTt3QkFDUCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBQzs0QkFDakMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUMsS0FBSyxDQUFDLENBQUM7NEJBQ3RDLElBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBRyxHQUFHLEVBQUM7Z0NBQ2pCLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dDQUN4RCxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTyxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsRUFBQyxDQUFBLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDLElBQUMsTUFBTSxDQUFDLENBQUM7Z0NBQy9GLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFDLElBQUksRUFBQyxDQUFDLENBQUM7Z0NBQzFELElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQ0FDL0IsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFDLEdBQUcsQ0FBQzs2QkFDNUI7aUNBQ0c7Z0NBQ0EsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFDLE9BQU8sRUFBRSxxQ0FBcUMsRUFBRSxTQUFTLEVBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztnQ0FDN0UsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2dDQUMvQixTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDcEM7eUJBQ0o7NkJBQ0ksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUM7NEJBQ3RDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBQyxPQUFPLEVBQUUsOENBQThDLEVBQUUsU0FBUyxFQUFDLElBQUksRUFBQyxDQUFDLENBQUM7NEJBQ3RGLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFDLElBQUksQ0FBQyxDQUFDO3lCQUN4QztxQkFDSjtpQkFDSjtZQUVELENBQUMsQ0FBQSxDQUFDLENBQUM7WUFFSCxTQUFTLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7O2dCQUVyQixNQUFNLEdBQUcsR0FBRyxJQUFJLDZCQUFnQixFQUFpQjtxQkFDaEQsYUFBYSxDQUNWLElBQUksMEJBQWEsRUFBRTtxQkFDZCxXQUFXLENBQUMsRUFBRSxDQUFDO3FCQUNmLFFBQVEsQ0FBQyxVQUFVLENBQUM7cUJBQ3BCLFFBQVEsQ0FBQyx3QkFBVyxDQUFDLE1BQU0sQ0FBQztxQkFDNUIsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUN6QixDQUFDO2dCQUNGLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUseUNBQXlDLEVBQUUsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUUxRixJQUFJLFNBQVMsR0FBTyxFQUFFLENBQUM7Z0JBQ3ZCLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztnQkFDcEIsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQyxHQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQUM7b0JBQy9CLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFDeEUsVUFBVSxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsSUFBSSxHQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDO2lCQUMxRjtnQkFDRCxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7Z0JBQ3BCLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztnQkFDbEIsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO2dCQUN0QixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLEdBQUMsT0FBTyxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUUsRUFBQztvQkFDL0IsWUFBWSxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDO2lCQUM5QztnQkFDRCxZQUFZLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsWUFBWSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0QsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO2dCQUN0QixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQUM7b0JBQy9DLElBQUksUUFBUSxHQUFHLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxLQUFLLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQkFFbkksSUFBRyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUM7d0JBQzdDLFVBQVUsSUFBSSxHQUFHLFFBQVEsSUFBSSxDQUFDO3FCQUNqQzt5QkFDRzt3QkFFQSxJQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBQzs0QkFFOUMsWUFBWSxJQUFJLEdBQUcsUUFBUSxJQUFJLENBQUM7eUJBQ25DOzZCQUNHOzRCQUNBLFFBQU8sU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0NBQzFDLEtBQUssSUFBSTtvQ0FDTCxRQUFRLElBQUUsR0FBRyxRQUFRLEtBQUssU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7b0NBQ2pELE1BQU07Z0NBQ1YsS0FBSyxJQUFJO29DQUNMLFFBQVEsSUFBRSxHQUFHLFFBQVEsS0FBSyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztvQ0FDakQsTUFBTTtnQ0FDVixLQUFLLElBQUk7b0NBQ0wsUUFBUSxJQUFFLEdBQUcsUUFBUSxLQUFLLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO29DQUNqRCxNQUFNO2dDQUNWLEtBQUssSUFBSTtvQ0FDTCxRQUFRLElBQUUsR0FBRyxRQUFRLEtBQUssU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7b0NBQ2pELE1BQU07Z0NBQ1Y7b0NBQ0ksT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0NBQ3ZDLE1BQU07NkJBQ2I7eUJBQ0o7cUJBQ0o7aUJBQ0o7Z0JBQ0QsSUFBRyxZQUFZLEtBQUssRUFBRSxFQUFDO29CQUNuQixZQUFZLEdBQUcsc0JBQXNCLENBQUM7aUJBQ3pDO2dCQUNELElBQUcsUUFBUSxLQUFLLEVBQUUsRUFBQztvQkFDZixRQUFRLEdBQUcsc0JBQXNCLENBQUM7aUJBQ3JDO2dCQUNELElBQUcsVUFBVSxLQUFLLEVBQUUsRUFBQztvQkFDakIsVUFBVSxHQUFHLHNCQUFzQixDQUFDO2lCQUN2QztnQkFDRCxNQUFNLEtBQUssR0FBRyxJQUFJLHlCQUFZLEVBQUU7cUJBQzNCLFFBQVEsQ0FBQyxPQUFPLENBQUM7cUJBQ2pCLFFBQVEsQ0FBQyxrQ0FBa0MsQ0FBQztxQkFDNUMsY0FBYyxDQUFDLHNDQUFzQyxDQUFDO3FCQUN0RCxTQUFTLENBQ04sRUFBQyxJQUFJLEVBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUMsS0FBSyxFQUFFLFVBQVUsRUFBQyxFQUNsRSxFQUFDLElBQUksRUFBQyxtQkFBbUIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBQyxFQUNoRSxFQUFDLElBQUksRUFBQyxrQkFBa0IsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBQyxFQUN4RCxFQUFDLElBQUksRUFBQyxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFDLENBQzdDO3FCQUNKLFlBQVksRUFBRTtxQkFDZCxTQUFTLENBQUMsRUFBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQztnQkFFekMsTUFBTSxPQUFPLEdBQWdCLE1BQUEsV0FBVyxDQUFDLEtBQUssMENBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFXLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFnQixDQUFDO2dCQUMvSCxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQ3hDLENBQUMsQ0FBQyxDQUFBO1FBQ04sQ0FBQztLQUFBO0NBR0E7QUE5T0Qsc0JBOE9DIn0=