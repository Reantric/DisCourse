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
const marked = new Discord.Collection();
class attendance {
    name() {
        return "attendance";
    }
    help() {
        return "Attendance made easy!";
    }
    cooldown() {
        return 6;
    }
    isThisInteraction(command) {
        return command === this.name();
    }
    data() {
        return new SlashCommandBuilder()
            .setName(this.name())
            .setDescription(this.help())
            .addStringOption((option) => option.setName('time')
            .setDescription('Enter a time! (in 24 hour format!)')
            .setRequired(true))
            .addIntegerOption((option) => option.setName('exptime')
            .setDescription('The amount of time attendance is valid for!'));
    }
    runCommand(interaction, Bot) {
        return __awaiter(this, void 0, void 0, function* () {
            var exptime = interaction.options.getInteger('exptime');
            if (exptime == undefined)
                exptime = 10;
            const time = interaction.options.getString('time').split(':');
            let ti = new Date();
            let now = new Date();
            ti.setHours(parseInt(time[1]));
            ti.setMinutes(parseInt(time[0]));
            ti = ti.getMilliseconds();
            if (!(now.getHours() < parseInt(time[0]) || (now.getHours() == parseInt(time[0]) && now.getMinutes() < parseInt(time[1])))) {
                ti = 24 * 60 * 60 * 1000 - ti;
            }
            console.log(ti, now.getMilliseconds());
            setTimeout(() => {
                setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    const row = new Discord.MessageActionRow()
                        .addComponents(new Discord.MessageButton()
                        .setCustomId('attend')
                        .setLabel(`I'm here!`)
                        .setStyle('PRIMARY'));
                    yield interaction.reply({ content: `<@&884297279866019880>`, components: [row] });
                    setTimeout(() => {
                        const row = new Discord.MessageActionRow()
                            .addComponents(new Discord.MessageButton()
                            .setCustomId('attend')
                            .setLabel(`Expired`)
                            .setStyle('DANGER')
                            .setDisabled(true));
                        interaction.editReply({ content: `<@&884297279866019880>`, components: [row] });
                    }, exptime * 1000);
                    const filter = (i) => i.customId === 'attend';
                    const collector = interaction.channel.createMessageComponentCollector({ filter, time: exptime * 1000 });
                    collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                        console.log(marked);
                        if (i.customId == 'attend') {
                            i.deferUpdate();
                            if (!marked.has(i.member.user.id)) {
                                i.followUp({ content: `Marked you here!`, ephemeral: true });
                                marked.set(i.member.user.id, false);
                            }
                            else if (!marked.get(i.member.user.id)) {
                                i.followUp({ content: `You have already been marked!`, ephemeral: true });
                                marked.set(i.member.user.id, true);
                            }
                        }
                    }));
                    collector.on('end', (collected) => __awaiter(this, void 0, void 0, function* () {
                        console.log(`Collected ${collected.size} items`);
                    }));
                }), 24 * 60 * 60 * 1000);
            }, ti);
        });
    }
}
exports.default = attendance;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0ZW5kYW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9hdHRlbmRhbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXNDO0FBRXRDLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBRS9ELE1BQU0sTUFBTSxHQUF1QyxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUU1RSxNQUFxQixVQUFVO0lBRTNCLElBQUk7UUFDQSxPQUFPLFlBQVksQ0FBQztJQUN4QixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sdUJBQXVCLENBQUM7SUFDbkMsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxPQUFlO1FBQzdCLE9BQU8sT0FBTyxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sSUFBSSxtQkFBbUIsRUFBRTthQUNyQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDM0IsZUFBZSxDQUFDLENBQUMsTUFBVSxFQUFFLEVBQUUsQ0FDaEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7YUFDcEIsY0FBYyxDQUFDLG9DQUFvQyxDQUFDO2FBQ3BELFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNiLGdCQUFnQixDQUFDLENBQUMsTUFBVSxFQUFFLEVBQUUsQ0FDN0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7YUFDcEIsY0FBYyxDQUFDLDZDQUE2QyxDQUFDLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRUssVUFBVSxDQUFDLFdBQWdCLEVBQUUsR0FBbUI7O1lBQ2xELElBQUksT0FBTyxH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