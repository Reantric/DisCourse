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
class askquestion {
    name() {
        return "askquestion";
    }
    help() {
        return "askquestion";
    }
    cooldown() {
        return 300;
    }
    isThisInteraction(command) {
        return command === "askquestion";
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
                .setDescription(`Asked by: ${interaction.member.displayName} #${interaction.member.user.discriminator}`)
                .addField(interaction.options.getString('question'), `Respond to this question using /replys with this question ID to have an opportunity to earn points!`)
                .setFooter(`Question ID: ${id}`)
                .setTimestamp();
            let msgid = "";
            interaction.channel.send({ content: `<@&${role.id}>`, embeds: [question] }).then((message) => {
                msgid = message.id;
                console.log([msgid, interaction.member.user.id]);
                questioninfo.set(id, [msgid, interaction.member.user.id]);
            }).catch((error) => console.log(error));
            interaction.reply({ content: `Your question was sent!`, ephemeral: true });
        });
    }
}
exports.default = askquestion;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNrcXVlc3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbWFuZHMvYXNrcXVlc3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBc0M7QUFFdEMsTUFBTSxFQUFFLG1CQUFtQixFQUFFLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDL0QsK0JBQStCO0FBQy9CLElBQUksR0FBRyxHQUFHLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QixJQUFJLFlBQVksR0FBRyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFdEMsTUFBcUIsV0FBVztJQUU1QixJQUFJO1FBQ0EsT0FBTyxhQUFhLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLGFBQWEsQ0FBQztJQUN6QixDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUNELGlCQUFpQixDQUFDLE9BQWU7UUFDN0IsT0FBTyxPQUFPLEtBQUssYUFBYSxDQUFDO0lBQ3JDLENBQUM7SUFDRCxJQUFJO1FBQ0osT0FBTyxJQUFJLG1CQUFtQixFQUFFO2FBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDcEIsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUMzQixlQUFlLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsY0FBYyxDQUFDLDBDQUEwQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7SUFDN0ksQ0FBQztJQUNELEtBQUs7UUFDRCxPQUFPLFNBQVMsQ0FBQztJQUNwQixDQUFDO0lBRUksVUFBVSxDQUFDLFdBQWdCLEVBQUUsR0FBbUI7O1lBQ2xELElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQyxLQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFrQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBaUIsQ0FBQztZQUMvRyxNQUFNLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUM1QyxRQUFRLENBQUMsUUFBUSxDQUFDLGdDQUFnQyxDQUFDO2lCQUNsRCxjQUFjLENBQUMsYUFBYSxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsS0FBSyxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztpQkFDdkcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFDLHFHQUFxRyxDQUFDO2lCQUN6SixTQUFTLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDO2lCQUMvQixZQUFZLEVBQUUsQ0FBQztZQUNoQixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDZixXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBQyxNQUFNLElBQUssQ0FBQyxFQUFFLEdBQUcsRUFBQyxNQUFNLEVBQUMsQ0FBQyxRQUFRLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBVyxFQUFFLEVBQUU7Z0JBQ3pGLEtBQUssR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7Z0JBQy9DLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLENBQUMsS0FBSyxFQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDNUQsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBVyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDOUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBQyx5QkFBeUIsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUM1RSxDQUFDO0tBQUE7Q0FDQTtBQTdDRCw4QkE2Q0MifQ==