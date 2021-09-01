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
const { SlashCommandBuilder } = require('@discordjs/builders');
class add_q {
    constructor() {
        this.aliases = ["addq"];
    }
    name() {
        return "addq";
    }
    help() {
        return "addq";
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
            .addSubcommand((subcommand) => subcommand
            .setName('server')
            .setDescription('Info about the server'));
    }
    runCommand(args, interaction, Bot) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = add_q;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkcS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9hZGRxLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBR0EsTUFBTSxFQUFFLG1CQUFtQixFQUFFLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFHL0QsTUFBcUIsS0FBSztJQUExQjtRQUNxQixZQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQTZCdkMsQ0FBQztJQTNCRyxJQUFJO1FBQ0EsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUNELGlCQUFpQixDQUFDLE9BQWU7UUFDN0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBQ0QsSUFBSTtRQUNKLE9BQU8sSUFBSSxtQkFBbUIsRUFBRTthQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDM0IsYUFBYSxDQUFDLENBQUMsVUFBYyxFQUFFLEVBQUUsQ0FDMUIsVUFBVTthQUNULE9BQU8sQ0FBQyxRQUFRLENBQUM7YUFDakIsY0FBYyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUssVUFBVSxDQUFDLElBQWMsRUFBRSxXQUFnQixFQUFFLEdBQW1COztRQUV0RSxDQUFDO0tBQUE7Q0FDQTtBQTlCRCx3QkE4QkMifQ==