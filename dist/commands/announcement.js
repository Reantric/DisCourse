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
        const commandBuilder = new SlashCommandBuilder();
        commandBuilder.setName(this.name());
        commandBuilder.setDescription(this.help());
        commandBuilder.addStringOption((option) => option.setName('topic')
            .setDescription('Topic: ').
            setRequired(true));
        commandBuilder.addStringOption((option) => option.setName('body')
            .setDescription('Body: ').
            setRequired(true));
        return commandBuilder;
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
            if (!interaction.isChatInputCommand())
                return;
            let topic = interaction.options.getString("topic");
            let body = interaction.options.getString("topic");
            let embed = new discord_js_1.EmbedBuilder();
            embed.setTitle("Announcement")
                .setColor('Random')
                .setDescription("This is an important message from your teacher.")
                .addFields({
                name: (topic ? topic : "Announcement"),
                value: (body ? body : "")
            })
                .setThumbnail(interaction.user.displayAvatarURL())
                .setTimestamp()
                .setFooter({ text: 'Powered by DisCourse' });
            channel.send({ content: `<@&${role.id}>`, embeds: [embed] });
        });
    }
}
exports.default = announcement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ub3VuY2VtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2Fubm91bmNlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUVBLDJDQUEwQztBQUUxQyxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUUvRCxNQUFxQixZQUFZO0lBQWpDO1FBQ3FCLFlBQU8sR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBMkQvQyxDQUFDO0lBekRHLElBQUk7UUFDQSxPQUFPLGNBQWMsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sY0FBYyxDQUFDO0lBQzFCLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBQ0QsaUJBQWlCLENBQUMsT0FBZTtRQUM3QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFDRCxJQUFJO1FBQ0EsTUFBTSxjQUFjLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ2pELGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDcEMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMzQyxjQUFjLENBQUMsZUFBZSxDQUMxQixDQUFDLE1BQWdDLEVBQUUsRUFBRSxDQUMzQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQzthQUN6QixjQUFjLENBQUMsU0FBUyxDQUFDO1lBQ2pCLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FDcEIsQ0FBQztRQUNGLGNBQWMsQ0FBQyxlQUFlLENBQzFCLENBQUMsTUFBZ0MsRUFBRSxFQUFFLENBQzNDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO2FBQ3hCLGNBQWMsQ0FBQyxRQUFRLENBQUM7WUFDaEIsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUNwQixDQUFDO1FBQ0YsT0FBTyxjQUFjLENBQUM7SUFDMUIsQ0FBQztJQUVELEtBQUs7UUFDRCxPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBRUMsVUFBVSxDQUFDLFdBQStCLEVBQUUsR0FBVzs7O1lBQ3pELElBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQyxLQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFVLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFTLENBQUM7WUFDL0YsTUFBTSxPQUFPLEdBQWdCLE1BQUEsV0FBVyxDQUFDLEtBQUssMENBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFXLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksZUFBZSxDQUFnQixDQUFDO1lBQ2pJLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUMsMEJBQTBCLEVBQUUsU0FBUyxFQUFDLElBQUksRUFBQyxDQUFDLENBQUM7WUFDeEUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRTtnQkFBRSxPQUFPO1lBQzlDLElBQUksS0FBSyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ25ELElBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2xELElBQUksS0FBSyxHQUFpQixJQUFJLHlCQUFZLEVBQUUsQ0FBQztZQUM3QyxLQUFLLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQztpQkFDN0IsUUFBUSxDQUFDLFFBQVEsQ0FBQztpQkFDbEIsY0FBYyxDQUFDLGlEQUFpRCxDQUFDO2lCQUNqRSxTQUFTLENBQUM7Z0JBQ1AsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQztnQkFDdEMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzthQUM1QixDQUFDO2lCQUNELFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7aUJBQ2pELFlBQVksRUFBRTtpQkFDZCxTQUFTLENBQUMsRUFBQyxJQUFJLEVBQUUsc0JBQXNCLEVBQUMsQ0FBQyxDQUFBO1lBQzFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBQyxPQUFPLEVBQUMsTUFBTSxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFDLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQyxDQUFDOztLQUM1RDtDQUNKO0FBNURELCtCQTREQyJ9