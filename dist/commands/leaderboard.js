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
const { SlashCommandBuilder } = require('@discordjs/builders');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhZGVyYm9hcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvbGVhZGVyYm9hcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBc0M7QUFFdEMsK0JBQStCO0FBQy9CLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBTS9ELFNBQVMsR0FBRyxDQUFDLENBQWEsRUFBRSxDQUFhO0lBQ3JDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNYLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1gsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUVkLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDYixPQUFPLENBQUMsQ0FBQzs7UUFHVCxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRXRDLENBQUM7QUFFRCxNQUFxQixXQUFXO0lBQWhDO1FBRXFCLFlBQU8sR0FBRyxDQUFDLGFBQWEsRUFBQyxJQUFJLENBQUMsQ0FBQTtJQXdLbkQsQ0FBQztJQXRLRyxJQUFJO1FBQ0EsT0FBTyxhQUFhLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLGFBQWEsQ0FBQztJQUN6QixDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUNELGlCQUFpQixDQUFDLE9BQWU7UUFDN0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBQ0QsSUFBSTtRQUNB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