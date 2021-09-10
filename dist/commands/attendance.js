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
const db = require("quick.db");
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
            let allRoleUsers = new Set();
            let copyRoleUsers = new Set();
            yield interaction.guild.members.fetch();
            let role = interaction.guild.roles.cache.find((role) => role.name == 'Student');
            interaction.guild.members.cache.forEach((v) => {
                if (v.roles.cache.has(role.id)) {
                    allRoleUsers.add(v);
                    copyRoleUsers.add(v);
                }
            });
            var exptime = interaction.options.getInteger('exptime');
            if (exptime == null)
                exptime = 10;
            const time = interaction.options.getString('time').split(':');
            let ti = new Date();
            let now = new Date();
            ti.setHours(parseInt(time[0]));
            ti.setMinutes(parseInt(time[1]));
            ti.setSeconds(0);
            let ms = ti.getTime() - now.getTime();
            if (ms < 0) {
                ms += 24 * 60 * 60 * 1000;
            }
            let endTime = new Date(ti.getTime() + exptime * 60000);
            yield interaction.reply({ ephemeral: true, content: `Attendance will appear at ${time[0].toString().padStart(2, "0")}:${time[1].toString().padStart(2, "0")} and end at ${endTime.getHours().toString().padStart(2, "0")}:${endTime.getMinutes().toString().padStart(2, "0")}` });
            setTimeout(() => {
                this.eric(Bot, interaction, exptime, allRoleUsers, role, copyRoleUsers);
                setInterval(this.eric, 24 * 60 * 60 * 1000, Bot, interaction, exptime, allRoleUsers, role, copyRoleUsers);
            }, ms);
        });
    }
    eric(Bot, interaction, exptime, allRoleUsers, role, copyRoleUsers) {
        return __awaiter(this, void 0, void 0, function* () {
            const row = new Discord.MessageActionRow()
                .addComponents(new Discord.MessageButton()
                .setCustomId('attend')
                .setLabel(`I'm here!`)
                .setStyle('PRIMARY'));
            msgToHold = yield interaction.channel.send({ content: `<@&${role.id}>`, components: [row] });
            setTimeout(() => {
                const row = new Discord.MessageActionRow()
                    .addComponents(new Discord.MessageButton()
                    .setCustomId('attend')
                    .setLabel(`Expired`)
                    .setStyle('DANGER')
                    .setDisabled(true));
                msgToHold.edit({ content: `<@&${role.id}>`, components: [row] });
            }, exptime * 60 * 1000);
            const filter = (i) => i.customId === 'attend';
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: exptime * 60 * 1000 });
            collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                if (i.customId == 'attend') {
                    i.deferUpdate();
                    if (!allRoleUsers.has(interaction.member)) {
                        i.followUp({ content: "You aren't a student! Get out!", ephemeral: true });
                    }
                    else {
                        if (!marked.has(i.member.user.id)) {
                            i.followUp({ content: `Marked you here! You earned a point!`, ephemeral: true });
                            marked.set(i.member.user.id, false);
                            copyRoleUsers.delete(i.member);
                            db.set(`${i.member.user.id}.points`, db.get(`${i.member.user.id}.points`) + 1);
                        }
                        else if (!marked.get(i.member.user.id)) {
                            i.followUp({ content: `You have already been marked!`, ephemeral: true });
                            marked.set(i.member.user.id, true);
                        }
                    }
                }
            }));
            collector.on('end', () => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const ailunicEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Absent Students!')
                    .setDescription('These people did not mark themselves present!')
                    .setThumbnail('https://i.pinimg.com/originals/80/fd/eb/80fdeb47d44130603f5a2e440c421a66.jpg');
                copyRoleUsers.forEach((member) => {
                    ailunicEmbed.addField(`${member.displayName}#${member.user.discriminator}`, 'zooman alert: h1gh priority!');
                });
                ailunicEmbed.setTimestamp()
                    .setFooter('im h1gh', 'https://i.pinimg.com/originals/80/fd/eb/80fdeb47d44130603f5a2e440c421a66.jpg');
                const channel = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.find((channel) => channel.name == 'teacher');
                channel.send({ embeds: [ailunicEmbed] });
            }));
        });
    }
}
exports.default = attendance;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0ZW5kYW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9hdHRlbmRhbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXNDO0FBQ3RDLCtCQUErQjtBQUUvQixNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUUvRCxNQUFNLE1BQU0sR0FBdUMsSUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDNUUsSUFBSSxTQUEwQixDQUFDO0FBRS9CLE1BQXFCLFVBQVU7SUFFM0IsSUFBSTtRQUNBLE9BQU8sWUFBWSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyx1QkFBdUIsQ0FBQztJQUNuQyxDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVELGlCQUFpQixDQUFDLE9BQWU7UUFDN0IsT0FBTyxPQUFPLEtBQUssSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyxJQUFJLG1CQUFtQixFQUFFO2FBQ3JDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDcEIsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUMzQixlQUFlLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQzthQUNwQixjQUFjLENBQUMsb0NBQW9DLENBQUM7YUFDcEQsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2IsZ0JBQWdCLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUM3QixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQzthQUNwQixjQUFjLENBQUMsNkNBQTZDLENBQUMsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFSyxVQUFVLENBQUMs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