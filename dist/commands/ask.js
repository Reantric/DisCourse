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
const { QuickDB } = require("quick.db");
const db = new QuickDB();
var questionId = db.table('id');
var questionInfo = db.table('qs');
class ask {
    name() {
        return "ask";
    }
    help() {
        return "Students can ask their own questions!";
    }
    cooldown() {
        return 600;
    }
    isThisInteraction(command) {
        return command === "ask";
    }
    data() {
        const commandBuilder = new SlashCommandBuilder();
        commandBuilder.setName(this.name());
        commandBuilder.setDescription(this.help());
        commandBuilder.addStringOption((option) => option.setName('question')
            .setDescription('Enter your question: ').
            setRequired(true));
        return commandBuilder;
    }
    perms() {
        return "student";
    }
    runCommand(interaction, Bot) {
        return __awaiter(this, void 0, void 0, function* () {
            var id = yield questionId.get("id");
            id = id.toString();
            yield questionId.set("id", (yield questionId.get("id")) + 1);
            let role = interaction.guild.roles.cache.find((role) => role.name == 'Student');
            const question = new discord_js_1.EmbedBuilder();
            question.setTitle("Your classmate has a question!")
                .setColor('Random')
                .setDescription(`Asked by: ${interaction.member.displayName} #${interaction.member.user.discriminator}`)
                .setThumbnail(interaction.member.user.displayAvatarURL)
                .addFields(interaction.options.getString('question'), `Respond to this question using /answer with this question ID to have an opportunity to earn points!`)
                .setFooter({ text: `Question ID: ${id}` })
                .setTimestamp();
            let msgid = "";
            interaction.channel.send({ content: `<@&${role.id}>`, embeds: [question] }).then((message) => __awaiter(this, void 0, void 0, function* () {
                msgid = message.id;
                yield questionInfo.set(id, [msgid, interaction.member.user.id]);
            })).catch((error) => console.log(error));
            interaction.reply({ content: `Your question was sent!`, ephemeral: true });
        });
    }
}
exports.default = ask;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2Fzay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNBLDJDQUEwQztBQUcxQyxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUMvRCxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hDLE1BQU0sRUFBRSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFFekIsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoQyxJQUFJLFlBQVksR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRWxDLE1BQXFCLEdBQUc7SUFFcEIsSUFBSTtRQUNBLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyx1Q0FBdUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUVELGlCQUFpQixDQUFDLE9BQWU7UUFDN0IsT0FBTyxPQUFPLEtBQUssS0FBSyxDQUFDO0lBQzdCLENBQUM7SUFFRCxJQUFJO1FBQ0EsTUFBTSxjQUFjLEdBQUcsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ2pELGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDcEMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMzQyxjQUFjLENBQUMsZUFBZSxDQUFDLENBQUMsTUFBZ0MsRUFBRSxFQUFFLENBQ3BFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO2FBQ3pCLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQztZQUN4QyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNuQixPQUFPLGNBQWMsQ0FBQTtJQUN6QixDQUFDO0lBRUQsS0FBSztRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFFSyxVQUFVLENBQUMsV0FBZ0IsRUFBRSxHQUFXOztZQUMxQyxJQUFJLEVBQUUsR0FBRyxNQUFNLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixNQUFNLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUEsTUFBTSxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzNELElBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQyxLQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFVLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFTLENBQUM7WUFDL0YsTUFBTSxRQUFRLEdBQUcsSUFBSSx5QkFBWSxFQUFFLENBQUM7WUFDcEMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQ0FBZ0MsQ0FBQztpQkFDbEQsUUFBUSxDQUFDLFFBQVEsQ0FBQztpQkFDbEIsY0FBYyxDQUFDLGFBQWEsV0FBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEtBQUssV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7aUJBQ3ZHLFlBQVksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDdEQsU0FBUyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFDLHFHQUFxRyxDQUFDO2lCQUMxSixTQUFTLENBQUMsRUFBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxFQUFDLENBQUM7aUJBQ3ZDLFlBQVksRUFBRSxDQUFDO1lBQ2hCLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNmLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTyxFQUFDLE1BQU0sSUFBSyxDQUFDLEVBQUUsR0FBRyxFQUFDLE1BQU0sRUFBQyxDQUFDLFFBQVEsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBTyxPQUFXLEVBQUUsRUFBRTtnQkFDL0YsS0FBSyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0JBQ25CLE1BQU0sWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxLQUFLLEVBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNsRSxDQUFDLENBQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQVcsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzlDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUMseUJBQXlCLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDNUUsQ0FBQztLQUFBO0NBQ0o7QUFyREQsc0JBcURDIn0=