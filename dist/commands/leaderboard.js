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
        return "A points leaderboard!";
    }
    cooldown() {
        return 600;
    }
    isThisInteraction(command) {
        return this.aliases.includes(command);
    }
    data() {
        return new SlashCommandBuilder()
            .setName(this.name())
            .setDescription(this.help());
    }
    perms() {
        return 'both';
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
                .setColor('AQUA')
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
                else
                    rounded = userArray[i][1];
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
            embed.addField(`You → ${initializer} **#${ind + 1}: ${interaction.member.user.username}**`, `**${Number(userArray[ind][1])}**`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhZGVyYm9hcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvbGVhZGVyYm9hcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBc0M7QUFFdEMsK0JBQStCO0FBQy9CLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBTS9ELFNBQVMsR0FBRyxDQUFDLENBQWEsRUFBRSxDQUFhO0lBQ3JDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNYLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1gsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUVkLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDYixPQUFPLENBQUMsQ0FBQzs7UUFHVCxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRXRDLENBQUM7QUFFRCxNQUFxQixXQUFXO0lBQWhDO1FBRXFCLFlBQU8sR0FBRyxDQUFDLGFBQWEsRUFBQyxJQUFJLENBQUMsQ0FBQTtJQXlLbkQsQ0FBQztJQXZLRyxJQUFJO1FBQ0EsT0FBTyxhQUFhLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLHVCQUF1QixDQUFDO0lBQ25DLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBQ0QsaUJBQWlCLENBQUMsT0FBZTtRQUM3QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFDRCxJQUFJO1FB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