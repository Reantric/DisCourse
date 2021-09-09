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
exports.confidence = void 0;
const Discord = require("discord.js");
const db = require("quick.db");
const { SlashCommandBuilder } = require('@discordjs/builders');
function confidence(x, n) {
    let BOUND = 0.05;
    BOUND * Math.sqrt(n) / Math.sqrt(x);
}
exports.confidence = confidence;
function cTC(a, b) {
    if (isNaN(a[1]))
        return 1;
    if (isNaN(b[1]))
        return -1;
    if (a[1] === b[1])
        return 0;
    else
        return (a[1] < b[1]) ? 1 : -1;
}
class leaderboard {
    constructor() {
        this.aliases = ["leaderboard", "lb"];
    }
    name() {
        return "leaderboard";
    }
    help() {
        return "leaderboard";
    }
    cooldown() {
        return 2;
    }
    isThisInteraction(command) {
        return this.aliases.includes(command);
    }
    data() {
        return new SlashCommandBuilder()
            .setName(this.name())
            .setDescription(this.help());
    }
    runCommand(interaction, Bot) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let userArray = [];
            let guildArray = interaction.guild.members.cache.map((element) => {
                return element.id;
            });
            for (const o of db.all()) {
                if (o.ID == "885542468693676054")
                    continue;
                if (guildArray.includes(o.ID)) {
                    let pts;
                    if (typeof o.data === 'string')
                        pts = JSON.parse(o.data).points;
                    else
                        pts = o.data.points;
                    userArray.push([o.ID, pts]);
                }
            }
            userArray.sort(cTC);
            const embed = new Discord.MessageEmbed()
                .setTitle('Points Leaderboard!')
                .setColor('#0099ff')
                .setAuthor(Bot.user.username, Bot.user.avatarURL())
                .setThumbnail('https://i.imgur.com/aowYZQG.jpeg');
            var count;
            if (interaction.guild.memberCount < 11) {
                count = interaction.guild.memberCount - 1;
            }
            else {
                count = 10;
            }
            let bruh = "ten";
            switch (count) {
                case 1:
                    bruh = "";
                    break;
                case 2:
                    bruh = "two";
                    break;
                case 3:
                    bruh = "three";
                    break;
                case 4:
                    bruh = "four";
                    break;
                case 5:
                    bruh = "five";
                    break;
                case 6:
                    bruh = "six";
                    break;
                case 7:
                    bruh = "seven";
                    break;
                case 8:
                    bruh = "eight";
                    break;
                case 9:
                    bruh = "nine";
                    break;
            }
            embed.setDescription(`Here are the top ${bruh} students who have accumulated the most points!`);
            let average = 0, activeCount = 0;
            for (const c of userArray) {
                if (!isNaN(c[1])) {
                    average += c[1];
                    activeCount++;
                }
            }
            average /= activeCount;
            if (isNaN(average))
                average = "N/A";
            else
                average = average.toFixed(2);
            embed.addField(`Average Server Score: `, `${(average)}`);
            for (var i = 0; i < count; i++) {
                let username = (_a = Bot.users.cache.find(user => user.id === userArray[i][0])) === null || _a === void 0 ? void 0 : _a.username;
                let rounded;
                if (isNaN(userArray[i][1])) {
                    console.log(username, userArray[i]);
                    rounded = NaN;
                    userArray[i][1] = "N/A";
                }
                else {
                    rounded = Math.round(userArray[i][1] * 2) / 2;
                    userArray[i][1] = userArray[i][1].toFixed(2);
                }
                let initializer = "";
                if (i == 0)
                    initializer = `<:first_place:822885876144275499>`;
                else if (i == 1)
                    initializer = `<:second_place:822887005679648778>`;
                else if (i == 2)
                    initializer = `<:third_place:822887031143137321>`;
                if (userArray[i][0] == interaction.member.user.id)
                    embed.addFields({ name: `${initializer} **#${(i + 1)}: ${username}**`, value: `**${userArray[i][1]}**` });
                else
                    embed.addFields({ name: `${initializer} #${(i + 1)}: ${username}`, value: `${userArray[i][1]}` });
            }
            embed.setTimestamp();
            let ind = this.search(userArray, interaction.member.user.id);
            let initializer = "";
            if (ind == 0)
                initializer = `<:first_place:822885876144275499>`;
            else if (ind == 1)
                initializer = `<:second_place:822887005679648778>`;
            else if (ind == 2)
                initializer = `<:third_place:822887031143137321>`;
            embed.addField(`${initializer} **#${ind + 1}: ${interaction.member.user.username}**`, `**${Number(userArray[ind][1]).toFixed(2)}**`);
            interaction.reply({ embeds: [embed], ephemeral: false });
        });
    }
    search(array, targetValue) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][0] == targetValue)
                return i;
        }
        return -1;
    }
}
exports.default = leaderboard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhZGVyYm9hcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvbGVhZGVyYm9hcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXNDO0FBRXRDLCtCQUErQjtBQUMvQixNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUUvRCxTQUFnQixVQUFVLENBQUMsQ0FBUyxFQUFFLENBQVM7SUFDM0MsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ2pCLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDdkMsQ0FBQztBQUhELGdDQUdDO0FBS0QsU0FBUyxHQUFHLENBQUMsQ0FBYSxFQUFFLENBQWE7SUFDckMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1gsT0FBTyxDQUFDLENBQUM7SUFDYixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDWCxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBRWQsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNiLE9BQU8sQ0FBQyxDQUFDOztRQUdULE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFdEMsQ0FBQztBQUVELE1BQXFCLFdBQVc7SUFBaEM7UUFFcUIsWUFBTyxHQUFHLENBQUMsYUFBYSxFQUFDLElBQUksQ0FBQyxDQUFBO0lBd0tuRCxDQUFDO0lBdEtHLElBQUk7UUFDQSxPQUFPLGFBQWEsQ0FBQztJQUN6QixDQUFDO0lBRUQsSUFB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