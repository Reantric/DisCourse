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
const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require('discord.js');
class checkstrikes {
    constructor() {
        this.aliases = ["buy"];
    }
    name() {
        return "buy";
    }
    help() {
        return "buy";
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
            .addStringOption((option) => option.setName('role_name').setDescription('Enter a name for your custom role!'));
    }
    runCommand(interaction, Bot) {
        return __awaiter(this, void 0, void 0, function* () {
            const role_name = interaction.options.getString('role_name');
            const row = new MessageActionRow()
                .addComponents(new MessageSelectMenu()
                .setCustomId('Select')
                .setPlaceholder('Nothing selected')
                .addOptions([
                {
                    label: 'Select me',
                    description: 'This is a description',
                    value: 'first_option',
                },
                {
                    label: 'You can select me too',
                    description: 'This is also a description',
                    value: 'second_option',
                },
            ]));
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Some title')
                .setURL('https://discord.js.org/')
                .setDescription('Some description here');
            yield interaction.reply({ content: 'Pong!', ephemeral: true, embeds: [embed], components: [row] });
        });
    }
}
exports.default = checkstrikes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2J1eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUdBLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQy9ELE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxZQUFZLEVBQUUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFcEYsTUFBcUIsWUFBWTtJQUFqQztRQUVxQixZQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQW9EdEMsQ0FBQztJQWxERyxJQUFJO1FBQ0EsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUNELGlCQUFpQixDQUFDLE9BQWU7UUFDN0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBQ0QsSUFBSTtRQUNBLE9BQU8sSUFBSSxtQkFBbUIsRUFBRTthQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDM0IsZUFBZSxDQUFDLENBQUMsTUFBVSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDLENBQUM7SUFDdkgsQ0FBQztJQUVLLFVBQVUsQ0FBQyxXQUFnQixFQUFFLEdBQW1COztZQUNsRCxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUM3RCxNQUFNLEdBQUcsR0FBRyxJQUFJLGdCQUFnQixFQUFFO2lCQUM3QixhQUFhLENBQ1YsSUFBSSxpQkFBaUIsRUFBRTtpQkFDbEIsV0FBVyxDQUFDLFFBQVEsQ0FBQztpQkFDckIsY0FBYyxDQUFDLGtCQUFrQixDQUFDO2lCQUNsQyxVQUFVLENBQUM7Z0JBQ1I7b0JBQ0ksS0FBSyxFQUFFLFdBQVc7b0JBQ2xCLFdBQVcsRUFBRSx1QkFBdUI7b0JBQ3BDLEtBQUssRUFBRSxjQUFjO2lCQUN4QjtnQkFDRDtvQkFDSSxLQUFLLEVBQUUsdUJBQXVCO29CQUM5QixXQUFXLEVBQUUsNEJBQTRCO29CQUN6QyxLQUFLLEVBQUUsZUFBZTtpQkFDekI7YUFDSixDQUFDLENBQ1QsQ0FBQztZQUVOLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBWSxFQUFFO2lCQUMzQixRQUFRLENBQUMsU0FBUyxDQUFDO2lCQUNuQixRQUFRLENBQUMsWUFBWSxDQUFDO2lCQUN0QixNQUFNLENBQUMseUJBQXlCLENBQUM7aUJBQ2pDLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBRTdDLE1BQU0sV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDM0csQ0FBQztLQUFBO0NBQ0E7QUF0REQsK0JBc0RDIn0=