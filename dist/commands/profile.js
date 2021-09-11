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
const db = require("quick.db");
class profile {
    name() {
        return "profile";
    }
    help() {
        return "View any student's profile! You can only view your own profile if you\'re a student";
    }
    cooldown() {
        return 2;
    }
    isThisInteraction(command) {
        return command === "profile";
    }
    data() {
        return new SlashCommandBuilder()
            .setName(this.name())
            .setDescription(this.help())
            .addUserOption((option) => option.setName('target').setDescription('Select a user').setRequired(true));
    }
    perms() {
        return 'both';
    }
    runCommand(interaction, Bot) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const user = interaction.options.getUser('target');
            let embed = new Discord.MessageEmbed();
            if ((_a = interaction.member.roles) === null || _a === void 0 ? void 0 : _a.cache.some((role) => role.name === 'Teacher')) {
                embed.setTitle(`${interaction.user.username}'s Profile`)
                    .setDescription(`Here is your info!`)
                    .setAuthor(user.username, user.avatarURL())
                    .setColor('RANDOM')
                    .addField(`Points`, `**${db.get(`${user.id}.points`)}**`, true)
                    .addField(`Strikes`, `**${db.get(`${user.id}.strikes`)}**`, true)
                    .addField(`Absences`, `**${db.get(`${user.id}.absences`)}**`, true)
                    .setThumbnail(user.avatarURL())
                    .setTimestamp(new Date())
                    .setFooter('DisCourse Profile');
                yield interaction.reply({ content: `Here is ${user}'s profile`, embeds: [embed], ephemeral: true });
            }
            else if (interaction.member.roles.cache.some((role) => role.name === 'Student')) {
                embed.setTitle(`${interaction.user.username}'s Profile`)
                    .setDescription(`Here is your info!`)
                    .setAuthor(interaction.user.username, interaction.user.avatarURL())
                    .setColor('RANDOM')
                    .addField(`Points`, `**${db.get(`${interaction.user.id}.points`)}**`, true)
                    .addField(`Strikes`, `**${db.get(`${interaction.user.id}.strikes`)}**`, true)
                    .addField(`Absences`, `**${db.get(`${user.id}.absences`)}**`, true)
                    .setThumbnail(interaction.user.avatarURL())
                    .setTimestamp(new Date())
                    .setFooter('DisCourse Profile');
                yield interaction.reply({ content: `Here is your profile. Since you're a student, you can't view other students' profiles.`, embeds: [embed], ephemeral: true });
            }
        });
    }
}
exports.default = profile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9wcm9maWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXNDO0FBRXRDLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQy9ELCtCQUErQjtBQUcvQixNQUFxQixPQUFPO0lBRXhCLElBQUk7UUFDQSxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8scUZBQXFGLENBQUM7SUFDakcsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxPQUFlO1FBQzdCLE9BQU8sT0FBTyxLQUFLLFNBQVMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sSUFBSSxtQkFBbUIsRUFBRTthQUNyQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDckIsYUFBYSxDQUFDLENBQUMsTUFBVSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMvRyxDQUFDO0lBQ0QsS0FBSztRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2pCLENBQUM7SUFFSSxVQUFVLENBQUMsV0FBZ0IsRUFBRSxHQUFtQjs7O1lBQ2xELE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ25ELElBQUksS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3ZDLElBQUksTUFBQSxXQUFXLENBQUMsTUFB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