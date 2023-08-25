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
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { SlashCommandBuilder } = require('@discordjs/builders');
class addpoints {
    constructor() {
        this.aliases = ["addpoints"];
    }
    name() {
        return "addpoints";
    }
    help() {
        return "Manually award points to any student.";
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
            .addUserOption((option) => option.setName('target').setDescription('Select a student to give points to.').setRequired(true))
            .addIntegerOption((option) => option.setName('points')
            .setDescription('How many points are you giving?')
            .setRequired(true));
    }
    perms() {
        return 'teacher';
    }
    runCommand(interaction, Bot) {
        return __awaiter(this, void 0, void 0, function* () {
            const int1 = interaction.options.getInteger('points');
            const user = interaction.options.getMember('target');
            yield db.add(`${user.id}.points`, int1);
            interaction.reply({ content: `You added ${int1} point(s) to ${user}.`, ephemeral: true });
        });
    }
}
exports.default = addpoints;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkcG9pbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2FkZHBvaW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUVBLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsTUFBTSxFQUFFLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUN6QixNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUcvRCxNQUFxQixTQUFTO0lBQTlCO1FBQ3FCLFlBQU8sR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBb0M1QyxDQUFDO0lBbENHLElBQUk7UUFDQSxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sdUNBQXVDLENBQUM7SUFDbkQsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxPQUFlO1FBQzdCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUNELElBQUk7UUFDSixPQUFPLElBQUksbUJBQW1CLEVBQUU7YUFDL0IsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNwQixjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQzNCLGFBQWEsQ0FBQyxDQUFDLE1BQVcsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxjQUFjLENBQUMscUNBQXFDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDaEksZ0JBQWdCLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUM3QixNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQzthQUNuQixjQUFjLENBQUMsaUNBQWlDLENBQUM7YUFDakQsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUNELEtBQUs7UUFDRCxPQUFPLFNBQVMsQ0FBQztJQUNwQixDQUFDO0lBRUksVUFBVSxDQUFDLFdBQWdCLEVBQUUsR0FBbUI7O1lBQ2xELE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQ3JELE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLFNBQVMsRUFBQyxJQUFJLENBQUMsQ0FBQTtZQUN0QyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLGFBQWEsSUFBSSxnQkFBZ0IsSUFBSSxHQUFHLEVBQUUsU0FBUyxFQUFDLElBQUksRUFBQyxDQUFDLENBQUM7UUFDM0YsQ0FBQztLQUFBO0NBQ0E7QUFyQ0QsNEJBcUNDIn0=