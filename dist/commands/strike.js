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
class strike {
    constructor() {
        this.aliases = ["strike"];
    }
    name() {
        return "strike";
    }
    help() {
        return "Manually strike a student for inappropriate behavior.";
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
            .addUserOption((option) => option.setName('target').setDescription('Select a student to strike').setRequired(true));
    }
    perms() {
        return 'teacher';
    }
    runCommand(interaction, Bot) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(interaction.member.roles.cache.some((role) => role.name === 'Teacher'))) {
                interaction.reply({ content: "Unfortunately, you cannot access this method because you do not have adminstrator privileges in the server.", ephemeral: true });
                return;
            }
            const user = interaction.options.getMember('target');
            let role = user.guild.roles.cache.find((r) => r.name === "Mute").id.toString();
            console.log(role);
            if (user.roles.cache.some((role) => role.name === 'Teacher')) {
                interaction.reply({ content: "You can't strike another teacher!", ephemeral: true });
                return;
            }
            else {
                yield db.add(`${user.id}.strikes`, 1);
                yield db.set(`${user.id}.points`, Math.max(0, (yield db.get(`${user.id}.points`)) - 2));
            }
            if ((yield db.get(`${user.id}.strikes`)) >= 3) {
                if (user.roles.cache.some((role) => role.name === 'Mute')) {
                    interaction.reply({ content: `This user has already been muted, but a strike was still added. This student now has ${yield db.get(`${user.id}.strikes`)} strike(s)`, ephemeral: true });
                    return;
                }
                else {
                    user.roles.set([role]);
                }
            }
            console.log('struck');
            console.log(yield db.get(`${user.id}.strikes`));
            interaction.reply({ content: `You struck ${user}. This student now has ${yield db.get(`${user.id}.strikes`)} strike(s)`, ephemeral: true });
        });
    }
}
exports.default = strike;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaWtlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3N0cmlrZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUdBLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsTUFBTSxFQUFFLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUN6QixNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUUvRCxNQUFxQixNQUFNO0lBQTNCO1FBRXFCLFlBQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBNER6QyxDQUFDO0lBMURHLElBQUk7UUFDQSxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sdURBQXVELENBQUM7SUFDbkUsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxPQUFlO1FBQzdCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUNELElBQUk7UUFDQSxPQUFPLElBQUksbUJBQW1CLEVBQUU7YUFDL0IsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNwQixjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQzNCLGFBQWEsQ0FBQyxDQUFDLE1BQVcsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxjQUFjLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM3SCxDQUFDO0lBQ0QsS0FBSztRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ3BCLENBQUM7SUFFSSxVQUFVLENBQUMsV0FBZ0IsRUFBRSxHQUFt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