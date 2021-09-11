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
class announcement {
    constructor() {
        this.aliases = ["announcement"];
    }
    name() {
        return "announcement";
    }
    help() {
        return "announcement";
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
            .addStringOption((option) => option.setName('topic').setDescription('Topic: ').setRequired(true))
            .addStringOption((option) => option.setName('body').setDescription('Body: ').setRequired(true));
    }
    perms() {
        return 'teacher';
    }
    runCommand(interaction, Bot) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            var role = interaction.guild.roles.cache.find((role) => role.name == 'Student');
            const channel = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.find((channel) => channel.name == 'announcements');
            interaction.reply({ content: "Creating announcement...", ephemeral: true });
            let embed = new Discord.MessageEmbed();
            embed.setTitle("Announcement")
                .setColor("RANDOM")
                .setDescription("This is an important message from your teacher.")
                .addField(interaction.options.getString("topic"), interaction.options.getString("body"))
                .setThumbnail(interaction.user.displayAvatarURL)
                .setTimestamp()
                .setThumbnail(interaction.user.displayAvatarURL)
                .setFooter(`Powered by DisCourse`);
            channel.send({ content: `<@&${role.id}>`, embeds: [embed] });
        });
    }
}
exports.default = announcement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ub3VuY2VtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2Fubm91bmNlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFzQztBQUV0QyxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUcvRCxNQUFxQixZQUFZO0lBQWpDO1FBQ3FCLFlBQU8sR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBMkMvQyxDQUFDO0lBekNHLElBQUk7UUFDQSxPQUFPLGNBQWMsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sY0FBYyxDQUFDO0lBQzFCLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBQ0QsaUJBQWlCLENBQUMsT0FBZTtRQUM3QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFDRCxJQUFJO1FBQ0osT0FBTyxJQUFJLG1CQUFtQixFQUFFO2FBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDcEIsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUN2QixlQUFlLENBQUMsQ0FBQyxNQUFXLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNyRyxlQUFlLENBQUMsQ0FBQyxNQUFXLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBQzVHLENBQUM7SUFDRCxLQUFLO1FBQ0QsT0FBTyxTQUFTLENBQUM7SUFDcEIsQ0FBQztJQUVJLFVBQVUsQ0FBQyxXQUFnQixFQUFFLEdBQW1COzs7WUFDbEQsSUFBSSxJQUFJLEdBQUcsV0FBVyxDQUFDLEtBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQWtCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFpQixDQUFDO1lBQy9HLE1BQU0sT0FBTyxHQUF3QixNQUFBLFdBQVcsQ0FBQyxLQUFLLDBDQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBVyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLGVBQWUsQ0FBd0IsQ0FBQztZQUM3SSxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFDLDBCQUEwQixFQUFFLFNBQVMsRUFBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDO1lBQ3hFLElBQUksS0FBSyxHQUF5QixJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUM3RCxLQUFLLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLFFBQVEsQ0FBQztpQkFDbEIsY0FBYyxDQUFDLGlEQUFpRCxDQUFDO2lCQUNqRSxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQ3RGLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO2lCQUMvQyxZQUFZLEVBQUU7aUJBQ2QsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7aUJBQy9DLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO1lBQ2xDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBQyxPQUFPLEVBQUMsTUFBTSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUMsTUFBTSxFQUFDLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQyxDQUFDOztLQUUvRDtDQUNKO0FBNUNELCtCQTRDQyJ9