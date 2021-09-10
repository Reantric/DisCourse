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
            .addUserOption((option) => option.setName('target').setDescription('Select a student to give points to.').setRequired(true))
            .addIntegerOption((option) => option.setName('points')
            .setDescription('How many points is this question worth?')
            .setRequired(true));
    }
    runCommand(interaction, Bot) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(interaction.member.roles.cache.some((role) => role.name === 'Teacher'))) {
                interaction.reply({ content: "Unfortunately, you cannot access this method because you do not have adminstrator privileges in the server.", ephemeral: true });
                return;
            }
            const int1 = interaction.options.getInteger('points');
            const user = interaction.options.getMember('target');
            db.add(`${user.id}.points`, int1);
            interaction.reply({ content: `You added ${int1} point(s) to ${user}.`, ephemeral: true });
        });
    }
}
exports.default = addpoints;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkcG9pbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2FkZHBvaW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUVBLCtCQUErQjtBQUMvQixNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUcvRCxNQUFxQixTQUFTO0lBQTlCO1FBQ3FCLFlBQU8sR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBd0M1QyxDQUFDO0lBdENHLElBQUk7UUFDQSxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sV0FBVyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBQ0QsaUJBQWlCLENBQUMsT0FBZTtRQUM3QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFDRCxJQUFJO1FBQ0osT0FBTyxJQUFJLG1CQUFtQixFQUFFO2FBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDcEIsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUMzQixhQUFhLENBQUMsQ0FBQyxNQUFXLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsY0FBYyxDQUFDLHFDQUFxQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hJLGdCQUFnQixDQUFDLENBQUMsTUFBVSxFQUFFLEVBQUUsQ0FDN0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7YUFDbkIsY0FBYyxDQUFDLHlDQUF5QyxDQUFDO2FBQ3pELFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRWhDLENBQUM7SUFFSyxVQUFVLENBQUMsV0FBZ0IsRUFBRSxHQUFtQjs7WUFFbEQsSUFBRyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQXVCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsRUFBQztnQkFDNUYsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSw2R0FBNkcsRUFBRSxTQUFTLEVBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQTtnQkFDM0osT0FBTzthQUNWO1lBQ0QsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDckQsTUFBTSxJQUFJLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFckQsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLFNBQVMsRUFBQyxJQUFJLENBQUMsQ0FBQTtZQUNoQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLGFBQWEsSUFBSSxnQkFBZ0IsSUFBSSxHQUFHLEVBQUUsU0FBUyxFQUFDLElBQUksRUFBQyxDQUFDLENBQUM7UUFDM0YsQ0FBQztLQUFBO0NBQ0E7QUF6Q0QsNEJBeUNDIn0=