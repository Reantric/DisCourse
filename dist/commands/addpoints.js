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
class addpoints {
    constructor() {
        this.aliases = ["addpoints"];
    }
    name() {
        return "addpoints";
    }
    help() {
        return "addpoints";
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
            .addIntegerOption((option) => option.setName('points')
            .setDescription('How many points is this question worth?'));
    }
    runCommand(interaction, Bot) {
        return __awaiter(this, void 0, void 0, function* () {
            const int1 = interaction.options.getInteger('points');
            console.log(int1);
            db.add(`${interaction.member.user.id}.questions`, int1);
            console.log(db.get(`${interaction.member.user.id}.questions`));
            interaction.reply({ content: `You added ${int1} point(s)`, ephemeral: true });
        });
    }
}
exports.default = addpoints;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkcG9pbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2FkZHBvaW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUVBLCtCQUErQjtBQUMvQixNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUcvRCxNQUFxQixTQUFTO0lBQTlCO1FBQ3FCLFlBQU8sR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBZ0M1QyxDQUFDO0lBOUJHLElBQUk7UUFDQSxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sV0FBVyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBQ0QsaUJBQWlCLENBQUMsT0FBZTtRQUM3QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFDRCxJQUFJO1FBQ0osT0FBTyxJQUFJLG1CQUFtQixFQUFFO2FBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDcEIsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUMzQixnQkFBZ0IsQ0FBQyxDQUFDLE1BQVUsRUFBRSxFQUFFLENBQzdCLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO2FBQ25CLGNBQWMsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVLLFVBQVUsQ0FBQyxXQUFnQixFQUFFLEdBQW1COztZQUNsRCxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUNyRCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ2pCLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLFlBQVksRUFBQyxJQUFJLENBQUMsQ0FBQTtZQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDL0QsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxhQUFhLElBQUksV0FBVyxFQUFFLFNBQVMsRUFBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQy9FLENBQUM7S0FBQTtDQUNBO0FBakNELDRCQWlDQyJ9