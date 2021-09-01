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
class getbanlist {
    constructor() {
        this.aliases = ["help"];
    }
    name() {
        return "help";
    }
    help() {
        return "help";
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
            .setDescription(this.help())
            .addUserOption((option) => option.setName(this.name()).setDescription(this.help()))
            .addStringOption((option) => option.setName('category')
            .setDescription('The gif category')
            .addChoice('Funny', 'gif_funny')
            .addChoice('Meme', 'gif_meme')
            .addChoice('Movie', 'gif_movie'));
    }
    runCommand(args, interaction, Bot) {
        return __awaiter(this, void 0, void 0, function* () {
            const string = interaction.options.getString('category');
            console.log(string);
            const embed = new Discord.MessageEmbed()
                .setTitle('Eclipse Help is Here!')
                .setDescription('Here are a list of our commands!')
                .setColor('#0ae090')
                .setAuthor(Bot.user.username, Bot.user.avatarURL())
                .addFields({ name: '!banlist (MOD ONLY)', value: 'Replies with the list of banned users from the server' })
                .addFields({ name: '!leaderboard, !lb', value: 'Gives leaderboard of the top ten most positive members based on sentiment scores' })
                .setThumbnail('https://wallpapercave.com/wp/wp4055520.png')
                .setTimestamp();
            interaction.reply({ embeds: [embed] });
        });
    }
}
exports.default = getbanlist;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9oZWxwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXNDO0FBR3RDLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBRy9ELE1BQXFCLFVBQVU7SUFBL0I7UUFFcUIsWUFBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7SUEyRHZDLENBQUM7SUF6REcsSUFBSTtRQUNBLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxPQUFlO1FBQzdCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLElBQUksbUJBQW1CLEVBQUU7YUFDckMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNwQixjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQzNCLGFBQWEsQ0FBQyxDQUFDLE1BQXNILEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2FBQzVMLGVBQWUsQ0FBQyxDQUFDLE1BQVUsRUFBRSxFQUFFLENBQzVCLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO2FBQ3JCLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQzthQUVsQyxTQUFTLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQzthQUMvQixTQUFTLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQzthQUM3QixTQUFTLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUE7SUFFN0MsQ0FBQztJQUVLLFVBQVUsQ0FBQyxJQUFjLEVBQUUsV0FBZ0IsRUFBRSxHQUFtQjs7WUFDbEUsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDekQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUNuQixNQUFNLEtBQUssR0FBRyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUU7aUJBQ3ZDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQztpQkFDakMsY0FBYyxDQUFDLGtDQUFrQyxDQUFDO2lCQUNsRCxRQUFRLENBQUMsU0FBUyxDQUFDO2lCQUNuQixTQUFTLENBQUMsR0FBRyxDQUFDLElBQUssQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLElBQUssQ0FBQyxTQUFTLEVBQUcsQ0FBQztpQkFHckQsU0FBUyxDQUNOLEVBQUUsSUFBSSxFQUFFLHFCQUFxQixFQUFFLEtBQUssRUFBRSx1REFBdUQsRUFBRSxDQUNsRztpQkFFQSxTQUFTLENBQ04sRUFBRSxJQUFJLEVBQUMsbUJBQW1CLEVBQUUsS0FBSyxFQUFDLGtGQUFrRixFQUFDLENBQ3hIO2lCQUNBLFlBQVksQ0FBQyw0Q0FBNEMsQ0FBQztpQkFDMUQsWUFBWSxFQUFFLENBQUE7WUFFbkIsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUMsQ0FBQztRQU16QyxDQUFDO0tBQUE7Q0FDQTtBQTdERCw2QkE2REMifQ==