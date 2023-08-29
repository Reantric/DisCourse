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
const __1 = require("..");
class help {
    name() {
        return "help";
    }
    help() {
        return "A list of all commands available to you.";
    }
    cooldown() {
        return 2;
    }
    isThisInteraction(command) {
        return command === "help";
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
            let embed = new discord_js_1.EmbedBuilder();
            let isTeacher = (_a = interaction.member.roles) === null || _a === void 0 ? void 0 : _a.cache.some((role) => role.name === 'Teacher');
            embed.setTitle('DisCourse Command List')
                .setDescription(`Here are a list of our ${isTeacher ? 'teacher' : 'student'} commands.`)
                .setColor('Blurple');
            __1.helpUtil.get().forEach((helpPerm, name) => {
                if ((helpPerm[1] != 'student' && isTeacher) || (helpPerm[1] != 'teacher' && !isTeacher)) {
                    embed.addFields({
                        name: '/' + name,
                        value: helpPerm[0]
                    });
                }
            });
            yield interaction.reply({ embeds: [embed], ephemeral: true });
        });
    }
}
exports.default = help;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9oZWxwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsMkNBQTBDO0FBRTFDLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQy9ELDBCQUE4QjtBQUc5QixNQUFxQixJQUFJO0lBRXJCLElBQUk7UUFDQSxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sMENBQTBDLENBQUM7SUFDdEQsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxPQUFlO1FBQzdCLE9BQU8sT0FBTyxLQUFLLE1BQU0sQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sSUFBSSxtQkFBbUIsRUFBRTthQUNyQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBQ0QsS0FBSztRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2pCLENBQUM7SUFFSSxVQUFVLENBQUMsV0FBZ0IsRUFBRSxHQUFXOzs7WUFDMUMsSUFBSSxLQUFLLEdBQUcsSUFBSSx5QkFBWSxFQUFFLENBQUM7WUFDL0IsSUFBSSxTQUFTLEdBQUcsTUFBQSxXQUFXLENBQUMsTUFBTyxDQUFDLEtBQUssMENBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQXVCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUM7WUFDNUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQztpQkFDdkMsY0FBYyxDQUFDLDBCQUEwQixTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxZQUFZLENBQUM7aUJBQ3ZGLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNyQixZQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBa0IsRUFBRSxJQUFZLEVBQUUsRUFBRTtnQkFDeEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxTQUFTLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7b0JBQ3JGLEtBQUssQ0FBQyxTQUFTLENBQUM7d0JBQ1osSUFBSSxFQUFFLEdBQUcsR0FBRyxJQUFJO3dCQUNoQixLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztxQkFDckIsQ0FBQyxDQUFDO2lCQUNOO1lBQ0wsQ0FBQyxDQUFDLENBQUE7WUFDRixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQzs7S0FDL0Q7Q0FDSjtBQTFDRCx1QkEwQ0MifQ==