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
const { SlashCommandBuilder } = require('@discordjs/builders');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
class profile {
    name() {
        return "profile";
    }
    help() {
        return "View any student's profile! You can only view your own profile if you\'re a student.";
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
            .addUserOption((option) => option.setName('target').setDescription('Select a user'));
    }
    perms() {
        return 'both';
    }
    formatProfileEmbed(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const embed = new discord_js_1.EmbedBuilder();
            embed.setTitle(`${user.username}'s Profile`)
                .setDescription(`Here is ${user.username}'s info!`)
                .setAuthor({ name: user.username, iconURL: user.avatarURL() })
                .setColor('Random')
                .addFields({
                name: 'Points',
                value: `**${yield db.get(`${user.id}.points`)}**`,
                inline: true
            })
                .addFields({
                name: 'Strikes',
                value: `**${yield db.get(`${user.id}.strikes`)}**`,
                inline: true
            })
                .addFields({
                name: 'Absences',
                value: `**${yield db.get(`${user.id}.absences`)}**`,
                inline: true
            })
                .setThumbnail(user.avatarURL())
                .setTimestamp(new Date())
                .setFooter({ text: 'DisCourse Profile' });
            return embed;
        });
    }
    runCommand(interaction, Bot) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = interaction.options.getUser('target');
            let roleManager = interaction.member.roles;
            if (roleManager.cache.has('Teacher')) {
                if (!user) {
                    user = interaction.user;
                }
                const embed = yield this.formatProfileEmbed(user);
                interaction.reply({
                    content: `Here is ${user}'s profile`,
                    embeds: [embed],
                    ephemeral: true
                });
            }
            else if (roleManager.cache.has('Student')) {
                let message = (user ?
                    "Since you're a student, you can't view other students' profiles." :
                    'Here is your profile.');
                user = interaction.user;
                const embed = yield this.formatProfileEmbed(user);
                interaction.reply({
                    content: message,
                    embeds: [embed],
                    ephemeral: true
                });
            }
        });
    }
}
exports.default = profile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9wcm9maWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsMkNBQTBDO0FBRzFDLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQy9ELE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsTUFBTSxFQUFFLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUV6QixNQUFxQixPQUFPO0lBRXhCLElBQUk7UUFDQSxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sc0ZBQXNGLENBQUM7SUFDbEcsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxPQUFlO1FBQzdCLE9BQU8sT0FBTyxLQUFLLFNBQVMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sSUFBSSxtQkFBbUIsRUFBRTthQUNyQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDckIsYUFBYSxDQUFDLENBQUMsTUFBVSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQzdGLENBQUM7SUFDRCxLQUFLO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVhLGtCQUFrQixDQUFDLElBQVU7O1lBQ3ZDLE1BQU0sS0FBSyxHQUFHLElBQUkseUJBQVksRUFBRSxDQUFDO1lBQ2pDLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxZQUFZLENBQUM7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