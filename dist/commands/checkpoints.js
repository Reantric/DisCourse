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
const db = require("quick.db");
const { SlashCommandBuilder } = require('@discordjs/builders');
class checkpoints {
    constructor() {
        this.aliases = ["check-points"];
    }
    name() {
        return "check-points";
    }
    help() {
        return "check-points";
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
            .addUserOption((option) => option.setName('target').setDescription('Select a student to check points for.').setRequired(true));
    }
    runCommand(interaction, Bot) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = interaction.options.getMember('target');
            if (user.roles.cache.some((role) => role.name === 'Teacher')) {
                interaction.reply({ content: "Teachers don't have points, silly.", ephemeral: true });
                return;
            }
            else {
                interaction.reply({ content: `This student has ${db.get(`${user.id}.points`)} point(s)`, ephemeral: true });
            }
        });
    }
}
exports.default = checkpoints;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2twb2ludHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvY2hlY2twb2ludHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQSwrQkFBK0I7QUFDL0IsTUFBTSxFQUFFLG1CQUFtQixFQUFFLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFFL0QsTUFBcUIsV0FBVztJQUFoQztRQUVxQixZQUFPLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtJQW1DL0MsQ0FBQztJQWpDRyxJQUFJO1FBQ0EsT0FBTyxjQUFjLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLGNBQWMsQ0FBQztJQUMxQixDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUNELGlCQUFpQixDQUFDLE9BQWU7UUFDN0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBQ0QsSUFBSTtRQUNBLE9BQU8sSUFBSSxtQkFBbUIsRUFBRTthQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDM0IsYUFBYSxDQUFDLENBQUMsTUFBVyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLGNBQWMsQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3hJLENBQUM7SUFFSyxVQUFVLENBQUMsV0FBZ0IsRUFBRSxHQUFtQjs7WUFFbEQsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckQsSUFBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFRLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLEVBQUM7Z0JBQzVELFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsb0NBQW9DLEVBQUUsU0FBUyxFQUFDLElBQUksRUFBQyxDQUFDLENBQUE7Z0JBQ2xGLE9BQU87YUFDVjtpQkFDRztnQkFDQSxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLG9CQUFvQixFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQzthQUM1RztRQUVMLENBQUM7S0FBQTtDQUNKO0FBckNELDhCQXFDQyJ9