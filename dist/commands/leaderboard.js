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
    if (a[1] === b[1]) {
        if (a[2] > b[2])
            return 1;
        else if (b[2] < a[2])
            return -1;
        return 0;
    }
    else {
        return (a[1] < b[1]) ? 1 : -1;
    }
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
                if (o.ID == "817230166824321054")
                    continue;
                if (guildArray.includes(o.ID)) {
                    let senti = o.data.points;
                    if (senti == undefined || senti == null)
                        senti = NaN;
                    userArray.push([o.ID, senti]);
                }
            }
            userArray.sort(cTC);
            const embed = new Discord.MessageEmbed()
                .setTitle('Positivity Leaderboard!')
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
            embed.setDescription(`Here are the top ${bruh} most positive people in the server!`);
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
                let confidence = "";
                if (!isNaN(rounded)) {
                    const n = userArray[i][2];
                    confidence = `± ${(1 - n / (n + 1)).toFixed(2)}`;
                }
                if (userArray[i][0] == interaction.member.user.id)
                    embed.addFields({ name: `${initializer} **#${(i + 1)}: ${username}**`, value: `**${userArray[i][1]} ${confidence} ()**` });
                else
                    embed.addFields({ name: `${initializer} #${(i + 1)}: ${username}`, value: `${userArray[i][1]} ${confidence} ()` });
            }
            embed.setTimestamp();
            let ind = this.search(userArray, interaction.author.id);
            let rounded = db.get(`${interaction.author.id}.recycleAmt`) == 0 ? NaN : Math.round(userArray[ind][1] * 2) / 2;
            let initializer = "";
            if (ind == 0)
                initializer = `<:first_place:822885876144275499>`;
            else if (ind == 1)
                initializer = `<:second_place:822887005679648778>`;
            else if (ind == 2)
                initializer = `<:third_place:822887031143137321>`;
            if (db.get(`${interaction.author.id}.recycleAmt`) == 0)
                embed.addField(`${initializer} **#${ind + 1}: ${interaction.author.username}**`, `**N/A ()**`);
            else {
                const n = userArray[ind][2];
                let confidence = `± ${(1 - n / (n + 1)).toFixed(2)}`;
                embed.addField(`${initializer} **#${ind + 1}: ${interaction.author.username}**`, `**${Number(userArray[ind][1]).toFixed(2)} ${confidence} ()**`);
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhZGVyYm9hcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvbGVhZGVyYm9hcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXNDO0FBRXRDLCtCQUErQjtBQUMvQixNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUUvRCxTQUFnQixVQUFVLENBQUMsQ0FBUyxFQUFFLENBQVM7SUFDM0MsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ2pCLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDdkMsQ0FBQztBQUhELGdDQUdDO0FBSUQsU0FBUyxHQUFHLENBQUMsQ0FBYSxFQUFFLENBQWE7SUFDckMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1gsT0FBTyxDQUFDLENBQUM7SUFDYixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDWCxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBRWQsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2YsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNYLE9BQU8sQ0FBQyxDQUFDO2FBQ1IsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQixPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2QsT0FBTyxDQUFDLENBQUM7S0FDWjtTQUNJO1FBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxD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