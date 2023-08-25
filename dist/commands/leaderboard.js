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
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { SlashCommandBuilder } = require('@discordjs/builders');
const setup_1 = require("../setup");
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
            for (const o of yield db.all()) {
                if (o.ID == setup_1.setupInfo.guildID)
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
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle('Points Leaderboard!')
                .setColor('Aqua')
                .setAuthor({ name: Bot.user.username, iconURL: Bot.user.avatarURL() })
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
            embed.addFields({ name: `Average Server Score: `, value: `${(average)}` });
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
            embed.addFields({
                name: `You → ${initializer} **#${ind + 1}: ${interaction.member.user.username}**`,
                value: `**${Number(userArray[ind][1])}**`
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVhZGVyYm9hcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvbGVhZGVyYm9hcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQSwyQ0FBMEM7QUFDMUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN4QyxNQUFNLEVBQUUsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQ3pCLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQy9ELG9DQUFxQztBQU1yQyxTQUFTLEdBQUcsQ0FBQyxDQUFhLEVBQUUsQ0FBYTtJQUNyQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDWCxPQUFPLENBQUMsQ0FBQztJQUNiLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNYLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFZCxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2IsT0FBTyxDQUFDLENBQUM7O1FBR1QsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUV0QyxDQUFDO0FBRUQsTUFBcUIsV0FBVztJQUFoQztRQUVxQixZQUFPLEdBQUcsQ0FBQyxhQUFhLEVBQUMsSUFBSSxDQUFDLENBQUE7SUF3S25ELENBQUM7SUF0S0csSUFBSTtRQUNBLE9BQU8sYUFBYSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyx1QkFBdUIsQ0FBQztJQUNuQyxDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUNELGlCQUFpQixDQUFDLE9BQWU7UUFDN0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBQ0QsSUFBSTtRQUNBLE9BQU8sSUFBSSxtQkFBbUIsRUFBRTthQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUNoQyxDQUFDO0lBQ0QsS0FBSztRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2pCLENBQUM7SUFFSSxVQUFVLENBQUMsV0FBdUMsRUFBRSxHQUFtQjs7O1lBRXpFLElBQUksU0FBUyxHQUFLLEVBQUUsQ0FBQztZQUNyQixJQUFJLFVBQVUsR0FBQyxXQUFXLENBQUMsS0FBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBWSxFQUFDLEVBQUU7Z0JBQ2hFLE9BQU8sT0FBTyxDQUFDLEVBQUUsQ0FBQTtZQUNyQixDQUFDLENBQUMsQ0FBQTtZQUVGLEtBQUksTUFBTSxDQUFDLElBQUksTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUM7Z0JBQzFCLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxpQkFBUyxDQUFDLE9BQU87b0JBQ3pCLFNBQVM7Z0JBQ2IsSUFBRyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQztvQkFDekIsSUFBSSxHQUFHLENBQUM7b0JBQ1IsSUFBSSxPQUFPLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUTt3QkFDMUIsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7d0JBRWhDLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztvQkFDNUIsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQTtpQkFDMUI7YUFDSjtZQUNELFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7WUFFbkIsTUFBTSxLQUFLLEdBQUcsSUFBSSx5QkFBWSxFQUFFO2lCQUMvQixRQUFRLENBQUMscUJBQXFCLENBQUM7aUJBQy9CLFFBQVEsQ0FBQyxNQUFNLENBQUM7aUJBQ2hCLFNBQVMsQ0FBQyxFQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLElBQUssQ0FBQyxTQUFTLEVBQUcsRUFBQyxDQUFDO2lCQUV0RSxZQUFZLENBQUMsa0NBQWtDLENBQUMsQ0FBQTtZQUVqRCxJQUFJLEtBQUssQ0FBQztZQUNWLElBQUcsV0FBVyxDQUFDLEtBQU0sQ0FBQyxXQUFXLEdBQUMsRUFBRSxFQUFDO2dCQUNsQyxLQUFLLEdBQUcsV0FBVyxDQUFDLEtBQU0sQ0FBQyxXQUFXLEdBQUMsQ0FBQyxDQUFDO2FBQzNDO2lCQUNHO2dCQUNBLEtBQUssR0FBQyxFQUFFLENBQUM7YUFDWjtZQUNELElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQztZQUNqQixRQUFRLEtBQUssRUFBQztnQkFDVixLQUFLLENBQUM7b0JBQ0YsSUFBSSxHQUFHLEVBQUUsQ0FBQTtvQkFDVCxNQUFNO2dCQUNWLEtBQUssQ0FBQztvQkFDRixJQUFJLEdBQUcsS0FBSyxDQUFBO29CQUNaLE1BQU07Z0JBQ04sS0FBSyxDQUFDO29CQUNGLElBQUksR0FBRyxPQUFPLENBQUE7b0JBQ2QsTUFBTTtnQkFDTixLQUFLLENBQUM7b0JBQ0YsSUFBSSxHQUFHLE1BQU0sQ0FBQTtvQkFDYixNQUFNO2dCQUVOLEtBQUssQ0FBQztvQkFDRixJQUFJLEdBQUcsTUFBTSxDQUFBO29CQUNiLE1BQU07Z0JBQ04sS0FBSyxDQUFDO29CQUNsQixJQUFJLEdBQUcsS0FBSyxDQUFBO29CQUNaLE1BQU07Z0JBQ04sS0FBSyxDQUFDO29CQUNOLElBQUksR0FBRyxPQUFPLENBQUE7b0JBQ2QsTUFBTTtnQkFDTixLQUFLLENBQUM7b0JBQ04sSUFBSSxHQUFHLE9BQU8sQ0FBQTtvQkFDZCxNQUFNO2dCQUNOLEtBQUssQ0FBQztvQkFDTixJQUFJLEdBQUcsTUFBTSxDQUFBO29CQUNiLE1BQU07YUFDYjtZQUdELEtBQUssQ0FBQyxjQUFjLENBQUMsb0JBQW9CLElBQUksaURBQWlELENBQUMsQ0FBQTtZQUMvRixJQUFJLE9BQU8sR0FBUSxDQUFDLEVBQUUsV0FBVyxHQUFHLENBQUMsQ0FBQztZQUN0QyxLQUFLLE1BQU0sQ0FBQyxJQUFJLFNBQVMsRUFBQztnQkFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztvQkFDYixPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO29CQUNmLFdBQVcsRUFBRSxDQUFDO2lCQUNqQjthQUNKO1lBQ0QsT0FBTyxJQUFJLFdBQVcsQ0FBQztZQUN2QixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUM7Z0JBQ2QsT0FBTyxHQUFHLEtBQUssQ0FBQzs7Z0JBRWhCLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWpDLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUUsS0FBSyxFQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQztZQUV4RSxLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsS0FBSyxFQUFDLENBQUMsRUFBRSxFQUFDO2dCQUNwQixJQUFJLFFBQVEsR0FBRyxNQUFBLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLDBDQUFFLFFBQVEsQ0FBQztnQkFDbkYsSUFBSSxPQUFPLENBQUM7Z0JBQ1IsSUFBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7b0JBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxPQUFPLEdBQUcsR0FBRyxDQUFDO29CQUNkLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7aUJBQ25DOztvQkFFVyxPQUFPLEdBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUUvQixJQUFJLFdBQVcsR0FBRyxFQUFFLENBQUM7Z0JBRXJCLElBQUcsQ0FBQyxJQUFFLENBQUM7b0JBQ0MsV0FBVyxHQUFHLG1DQUFtQyxDQUFDO3FCQUNyRCxJQUFHLENBQUMsSUFBRSxDQUFDO29CQUNKLFdBQVcsR0FBRyxvQ0FBb0MsQ0FBQztxQkFDdEQsSUFBRyxDQUFDLElBQUUsQ0FBQztvQkFDSixXQUFXLEdBQUcsbUNBQW1DLENBQUM7Z0JBRzFELElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxNQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQzlDLEtBQUssQ0FBQyxTQUFTLENBQ1gsRUFBRSxJQUFJLEVBQUMsR0FBRyxXQUFXLE9BQU8sQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUMsQ0FBRSxDQUFBOztvQkFFMUYsS0FBSyxDQUFDLFNBQVMsQ0FDWCxFQUFFLElBQUksRUFBQyxHQUFHLFdBQVcsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBQyxDQUFFLENBQUE7YUFDN0Y7WUFFRCxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUE7WUFDcEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUMsV0FBVyxDQUFDLE1BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDN0QsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDO1lBRWIsSUFBRyxHQUFHLElBQUUsQ0FBQztnQkFDRCxXQUFXLEdBQUcsbUNBQW1DLENBQUM7aUJBQ3JELElBQUcsR0FBRyxJQUFFLENBQUM7Z0JBQ04sV0FBVyxHQUFHLG9DQUFvQyxDQUFDO2lCQUN0RCxJQUFHLEdBQUcsSUFBRSxDQUFDO2dCQUNOLFdBQVcsR0FBRyxtQ0FBbUMsQ0FBQztZQUlsRSxLQUFLLENBQUMsU0FBUyxDQUFDO2dCQUNaLElBQUksRUFBRSxTQUFTLFdBQVcsT0FBTyxHQUFHLEdBQUMsQ0FBQyxLQUFLLFdBQVcsQ0FBQyxNQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSTtnQkFDaEYsS0FBSyxFQUFDLEtBQUssTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJO2FBQzNDLENBQUMsQ0FBQTtZQUVOLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQTs7S0FDeEQ7SUFFRCxNQUFNLENBQUMsS0FBYyxFQUFFLFdBQWdCO1FBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDO1lBQ2xDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFdBQVc7Z0JBQzFCLE9BQU8sQ0FBQyxDQUFDO1NBQ2hCO1FBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNkLENBQUM7Q0FHQTtBQTFLRCw4QkEwS0MifQ==