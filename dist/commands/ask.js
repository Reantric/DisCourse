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
var qid = new db.table('id');
var questioninfo = new db.table('qs');
class ask {
    name() {
        return "ask";
    }
    help() {
        return "ask";
    }
    cooldown() {
        return 600;
    }
    isThisInteraction(command) {
        return command === "ask";
    }
    data() {
        return new SlashCommandBuilder()
            .setName(this.name())
            .setDescription(this.help())
            .addStringOption((option) => option.setName('question').setDescription('Enter your question (just the question):').setRequired(true));
    }
    perms() {
        return "student";
    }
    runCommand(interaction, Bot) {
        return __awaiter(this, void 0, void 0, function* () {
            var id = qid.get("id");
            id = id.toString();
            qid.set("id", qid.get("id") + 1);
            let role = interaction.guild.roles.cache.find((role) => role.name == 'Student');
            const question = new Discord.MessageEmbed();
            question.setTitle("Your classmate has a question!")
                .setColor('#FEE75C')
                .setDescription(`Asked by: ${interaction.member.displayName} #${interaction.member.user.discriminator}`)
                .setThumbnail(interaction.member.user.avatarURL)
                .addField(interaction.options.getString('question'), `Respond to this question using /replys with this question ID to have an opportunity to earn points!`)
                .setFooter(`Question ID: ${id}`)
                .setTimestamp();
            let msgid = "";
            interaction.channel.send({ content: `<@&${role.id}>`, embeds: [question] }).then((message) => {
                msgid = message.id;
                questioninfo.set(id, [msgid, interaction.member.user.id]);
            }).catch((error) => console.log(error));
            interaction.reply({ content: `Your question was sent!`, ephemeral: true });
        });
    }
}
exports.default = ask;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2Fzay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFzQztBQUV0QyxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUMvRCwrQkFBK0I7QUFDL0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLElBQUksWUFBWSxHQUFHLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUV0QyxNQUFxQixHQUFHO0lBRXBCLElBQUk7UUFDQSxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBQ0QsaUJBQWlCLENBQUMsT0FBZTtRQUM3QixPQUFPLE9BQU8sS0FBSyxLQUFLLENBQUM7SUFDN0IsQ0FBQztJQUNELElBQUk7UUFDSixPQUFPLElBQUksbUJBQW1CLEVBQUU7YUFDL0IsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNwQixjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQzNCLGVBQWUsQ0FBQyxDQUFDLE1BQVUsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxjQUFjLENBQUMsMENBQTBDLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUM3SSxDQUFDO0lBQ0QsS0FBSztRQUNELE9BQU8sU0FBUyxDQUFDO0lBQ3BCLENBQUM7SUFFSSxVQUFVLENBQUMsV0FBZ0IsRUFBRSxHQUFtQjs7WUFDbEQsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2QixFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25CLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxJQUFJLEdBQUcsV0FBVyxDQUFDLEtBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQWtCLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFpQixDQUFDO1lBQy9HLE1BQU0sUUFBUSxHQUFHLElBQUksT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQzVDLFFBQVEsQ0FBQyxRQUFRLENBQUMsZ0NBQWdDLENBQUM7aUJBQ2xELFFBQVEsQ0FBQyxTQUFTLENBQUM7aUJBQ25CLGNBQWMsQ0FBQyxhQUFhLFdBQVcsQ0FBQyxNQUFNLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2lCQUN2RyxZQUFZLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2lCQUMvQyxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUMscUdBQXFHLENBQUM7aUJBQ3pKLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUM7aUJBQy9CLFlBQVksRUFBRSxDQUFDO1lBQ2hCLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNmLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTyxFQUFDLE1BQU0sSUFBSyxDQUFDLEVBQUUsR0FBRyxFQUFDLE1BQU0sRUFBQyxDQUFDLFFBQVEsQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFXLEVBQUUsRUFBRTtnQkFDekYsS0FBSyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0JBRW5CLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsS0FBSyxFQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDNUQsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBVyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDOUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBQyx5QkFBeUIsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUM1RSxDQUFDO0tBQUE7Q0FDQTtBQS9DRCxzQkErQ0MifQ==