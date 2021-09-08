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
let msgToHold;
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
            ti.setHours(parseInt(time[0]));
            ti.setMinutes(parseInt(time[1]));
            ti.setSeconds(now.getSeconds());
            let ms = ti.getTime() - now.getTime();
            if (ms < 0) {
                ms += 24 * 60 * 60 * 1000;
            }
            let endTime = new Date(ti.getTime() + exptime * 60000);
            console.log(time, ti, now.getHours(), now.getMinutes());
            yield interaction.reply(`Attendance will appear at ${time[0]}:${time[1]} and end at ${endTime.getHours()}:${endTime.getMinutes()}`);
            setTimeout(() => {
                this.eric(interaction, exptime);
                setInterval(this.eric, 24 * 60 * 60 * 1000, interaction, exptime);
            }, ms);
        });
    }
    eric(interaction, exptime) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("running timeout");
            const row = new Discord.MessageActionRow()
                .addComponents(new Discord.MessageButton()
                .setCustomId('attend')
                .setLabel(`I'm here!`)
                .setStyle('PRIMARY'));
            msgToHold = yield interaction.channel.send({ content: `<@&884297279866019880>`, components: [row] });
            setTimeout(() => {
                const row = new Discord.MessageActionRow()
                    .addComponents(new Discord.MessageButton()
                    .setCustomId('attend')
                    .setLabel(`Expired`)
                    .setStyle('DANGER')
                    .setDisabled(true));
                msgToHold.edit({ content: `<@&884297279866019880>`, components: [row] });
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
                console.log(collected);
            }));
        });
    }
}
exports.default = attendance;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0ZW5kYW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9hdHRlbmRhbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXNDO0FBRXRDLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBRS9ELE1BQU0sTUFBTSxHQUF1QyxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUM1RSxJQUFJLFNBQTBCLENBQUM7QUFFL0IsTUFBcUIsVUFBVTtJQUUzQixJQUFJO1FBQ0EsT0FBTyxZQUFZLENBQUM7SUFDeEIsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLHVCQUF1QixDQUFDO0lBQ25DLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBRUQsaUJBQWlCLENBQUMsT0FBZTtRQUM3QixPQUFPLE9BQU8sS0FBSyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkMsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLElBQUksbUJBQW1CLEVBQUU7YUFDckMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNwQixjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQzNCLGVBQWUsQ0FBQyxDQUFDLE1BQVUsRUFBRSxFQUFFLENBQ2hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyxvQ0FBb0MsQ0FBQzthQUNwRCxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDYixnQkFBZ0IsQ0FBQyxDQUFDLE1BQVUsRUFBRSxFQUFFLENBQzdCLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVLLFVBQVUsQ0FBQyxXQUFnQixFQUFFLEdB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