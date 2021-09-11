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
const db = require("quick.db");
var questions = new db.table('qs');
class replys {
    name() {
        return "replys";
    }
    help() {
        return "replys";
    }
    cooldown() {
        return 2;
    }
    isThisInteraction(command) {
        return command === "replys";
    }
    data() {
        return new SlashCommandBuilder()
            .setName(this.name())
            .setDescription(this.help())
            .addIntegerOption((option) => option.setName('id').setDescription('Enter the id of the question you want to respond to:').setRequired(true))
            .addStringOption((option) => option.setName('answer').setDescription('Enter the id of the question you want to respond to:').setRequired(true));
    }
    perms() {
        return 'student';
    }
    runCommand(interaction, Bot) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = interaction.options.getInteger("id").toString();
            if (questions.has(interaction.options.getInteger("id").toString())) {
                let info = questions.get(id);
                interaction.reply({ content: "Your answer has been sent.", ephemeral: true });
                interaction.channel.messages.fetch(info[0])
                    .then((msg) => {
                    const question = msg.embeds[0].fields[0].name;
                    const answer = new Discord.MessageEmbed();
                    answer.setTitle("A classmate answered your question!")
                        .setDescription(`Answered by: ${interaction.member.displayName} #${interaction.member.user.discriminator}`)
                        .addField(question, interaction.options.getString('answer'))
                        .setFooter(`Question ID: ${id}`)
                        .setTimestamp();
                    msg.reply({ content: `<@&${info[1]}>`, embeds: [answer] });
                });
            }
            else {
                interaction.reply({ content: "We couldn't find that question. You should be in the same channel to answer a question!", ephemeral: true });
            }
        });
    }
}
exports.default = replys;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbHlzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL3JlcGx5cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFzQztBQUV0QyxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUMvRCwrQkFBK0I7QUFDL0IsSUFBSSxTQUFTLEdBQUcsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRW5DLE1BQXFCLE1BQU07SUFFdkIsSUFBSTtRQUNBLE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxPQUFlO1FBQzdCLE9BQU8sT0FBTyxLQUFLLFFBQVEsQ0FBQztJQUNoQyxDQUFDO0lBQ0QsSUFBSTtRQUNKLE9BQU8sSUFBSSxtQkFBbUIsRUFBRTthQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDM0IsZ0JBQWdCLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLHNEQUFzRCxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQy9JLGVBQWUsQ0FBQyxDQUFDLE1BQVUsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxjQUFjLENBQUMsc0RBQXNELENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUN2SixDQUFDO0lBQ0QsS0FBSztRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ3BCLENBQUM7SUFFSSxVQUFVLENBQUMsV0FBZ0IsRUFBRSxHQUFtQjs7WUFDbEQsSUFBSSxFQUFFLEdBQVUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEUsSUFBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUM7Z0JBQzlELElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzdCLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUMsNEJBQTRCLEVBQUMsU0FBUyxFQUFDLElBQUksRUFBQyxDQUFDLENBQUE7Z0JBQ3hFLFdBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ3RDLElBQUksQ0FBQyxDQUFDLEdBQU8sRUFBRSxFQUFFO29CQUNkLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztvQkFDOUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7b0JBQzFDLE1BQU0sQ0FBQyxRQUFRLENBQUMscUNBQXFDLENBQUM7eUJBQ3JELGNBQWMsQ0FBQyxnQkFBZ0IsV0FBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7eUJBQzFHLFFBQVEsQ0FBQyxRQUFRLEVBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7eUJBQzFELFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUM7eUJBQy9CLFlBQVksRUFBRSxDQUFDO29CQUNoQixHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUMsTUFBTSxFQUFDLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxDQUFBO2dCQUNqRSxDQUFDLENBQUMsQ0FBQzthQUNGO2lCQUNHO2dCQUNBLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUMseUZBQXlGLEVBQUMsU0FBUyxFQUFDLElBQUksRUFBQyxDQUFDLENBQUM7YUFDekk7UUFDTCxDQUFDO0tBQUE7Q0FDQTtBQWhERCx5QkFnREMifQ==