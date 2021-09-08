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
class attendance {
    name() {
        return "attendance";
    }
    help() {
        return "attendance";
    }
    cooldown() {
        return 2;
    }
    isThisInteraction(command) {
        return command === this.name();
    }
    data() {
        return new SlashCommandBuilder()
            .setName(this.name())
            .setDescription(this.help())
            .addStringOption((option) => option.setName('input')
            .setDescription('The input to echo back')
            .setRequired(true));
    }
    runCommand(interaction, Bot) {
        return __awaiter(this, void 0, void 0, function* () {
            const row = new Discord.MessageActionRow()
                .addComponents(new Discord.MessageButton()
                .setCustomId('primary')
                .setLabel(`I'm here!`)
                .setStyle('PRIMARY'));
            yield interaction.reply({ content: `<@&884297279866019880>`, components: [row] });
            yield setInterval(() => {
                const row = new Discord.MessageActionRow()
                    .addComponents(new Discord.MessageButton()
                    .setCustomId('primary')
                    .setLabel(`Expired`)
                    .setStyle('DANGER'));
                interaction.editReply({ content: `<@&884297279866019880>`, components: [row] });
            }, 10000);
            const filter = (i) => i.customId === 'primary';
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10000 });
            collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                i.deferUpdate();
            }));
            collector.on('end', (collected) => __awaiter(this, void 0, void 0, function* () {
                console.log(`Collected ${collected.size} items`);
            }));
        });
    }
}
exports.default = attendance;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0ZW5kYW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9hdHRlbmRhbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXNDO0FBRXRDLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBRS9ELE1BQXFCLFVBQVU7SUFFM0IsSUFBSTtRQUNBLE9BQU8sWUFBWSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyxZQUFZLENBQUM7SUFDeEIsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxPQUFlO1FBQzdCLE9BQU8sT0FBTyxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sSUFBSSxtQkFBbUIsRUFBRTthQUNyQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDM0IsZUFBZSxDQUFDLENBQUMsTUFBVSxFQUFFLEVBQUUsQ0FDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7YUFDckIsY0FBYyxDQUFDLHdCQUF3QixDQUFDO2FBQ3hDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFFSyxVQUFVLENBQUMsV0FBZ0IsRUFBRSxHQUFtQjs7WUFFbEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxPQUFPLENBQUMsZ0JBQWdCLEVBQUU7aUJBQzlDLGFBQWEsQ0FDYixJQUFJLE9BQU8sQ0FBQyxhQUFhLEVBQUU7aUJBQ3pCLFdBQVcsQ0FBQyxTQUFTLENBQUM7aUJBQ3RCLFFBQVEsQ0FBQyxXQUFXLENBQUM7aUJBQ3JCLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FDckIsQ0FBQztZQUVHLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbEYsTUFBTSxXQUFXLENBQUMsR0FBRyxFQUFFO2dCQUNuQixNQUFNLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtxQkFDbEQsYUFBYSxDQUNiLElBQUksT0FBTyxDQUFDLGFBQWEsRUFBRTtxQkFDekIsV0FBVyxDQUFDLFNBQVMsQ0FBQztxQkFDdEIsUUFBUSxDQUFDLFNBQVMsQ0FBQztxQkFDbkIsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUNwQixDQUFDO2dCQUNPLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRXBGLENBQUMsRUFBQyxLQUFLLENBQUMsQ0FBQztZQUVULE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBNEIsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUM7WUFFMUUsTUFBTSxTQUFTLEdBQTRELFdBQVcsQ0FBQyxPQUFRLENBQUMsK0JBQStCLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFFekosU0FBUyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBTyxDQUE0QixFQUFFLEVBQUU7Z0JBQzNELENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUlwQixDQUFDLENBQUEsQ0FBQyxDQUFDO1lBRUgsU0FBUyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBTyxTQUFjLEVBQUUsRUFBRTtnQkFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLFNBQVMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDO1lBQ3JELENBQUMsQ0FBQSxDQUNBLENBQUM7UUFFTixDQUFDO0tBQUE7Q0FDSjtBQXBFRCw2QkFvRUMifQ==