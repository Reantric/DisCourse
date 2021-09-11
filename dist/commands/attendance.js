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
    perms() {
        return 'teacher';
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
            yield interaction.guild.members.fetch();
            let role = interaction.guild.roles.cache.find((role) => role.name == 'Student');
            interaction.guild.members.cache.forEach((v) => {
                if (v.roles.cache.has(role.id)) {
                    allRoleUsers.add(v);
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
                this.eric(Bot, interaction, exptime, allRoleUsers, role);
                setInterval(this.eric, 24 * 60 * 60 * 1000, Bot, interaction, exptime, allRoleUsers, role);
            }, ms);
        });
    }
    eric(Bot, interaction, exptime, allRoleUsers, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const row = new Discord.MessageActionRow()
                .addComponents(new Discord.MessageButton()
                .setCustomId('attend')
                .setLabel(`I'm here!`)
                .setStyle('PRIMARY'));
            msgToHold = yield interaction.channel.send({ content: `Click here to mark yourself present! \n <@&${role.id}>`, components: [row] });
            setTimeout(() => {
                const row = new Discord.MessageActionRow()
                    .addComponents(new Discord.MessageButton()
                    .setCustomId('attend')
                    .setLabel(`Expired`)
                    .setStyle('DANGER')
                    .setDisabled(true));
                msgToHold.edit({ content: `You were too late! \n <@&${role.id}>`, components: [row] });
            }, exptime * 60 * 1000);
            const filter = (i) => i.customId === 'attend';
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: exptime * 60 * 1000 });
            collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                if (i.customId == 'attend') {
                    i.deferUpdate();
                    if (!interaction.member.roles.cache.has(role.id)) {
                        i.followUp({ content: "You aren't a student! Get out!", ephemeral: true });
                    }
                    else {
                        if (!marked.has(i.member.user.id)) {
                            i.followUp({ content: `Marked you here! You earned a point!`, ephemeral: true });
                            marked.set(i.member.user.id, false);
                            allRoleUsers.delete(i.member);
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
                var _a, _b;
                Array.from(allRoleUsers).sort((a, b) => {
                    const aAb = db.get(`${a.id}.absences`);
                    const bAb = db.get(`${b.id}.absences`);
                    if (aAb > bAb)
                        return 1;
                    else if (bAb > aAb)
                        return -1;
                    return 0;
                });
                const ailunicEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Absent Students!')
                    .setDescription('These people did not mark themselves present!')
                    .setThumbnail('https://i.pinimg.com/originals/80/fd/eb/80fdeb47d44130603f5a2e440c421a66.jpg');
                allRoleUsers.forEach((member) => {
                    ailunicEmbed.addField(`${member.displayName}#${member.user.discriminator}`, `${db.get(`${member.id}.absences`)} absence(s)`);
                });
                ailunicEmbed.setTimestamp()
                    .setFooter('Report!', `${(_a = Bot.user) === null || _a === void 0 ? void 0 : _a.avatarURL}`);
                const channel = (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.channels.cache.find((channel) => channel.name == 'teacher');
                channel.send({ embeds: [ailunicEmbed] });
            }));
        });
    }
}
exports.default = attendance;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0ZW5kYW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9hdHRlbmRhbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXNDO0FBQ3RDLCtCQUErQjtBQUUvQixNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUUvRCxNQUFNLE1BQU0sR0FBdUMsSUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDNUUsSUFBSSxTQUEwQixDQUFDO0FBRS9CLE1BQXFCLFVBQVU7SUFFM0IsSUFBSTtRQUNBLE9BQU8sWUFBWSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyx1QkFBdUIsQ0FBQztJQUNuQyxDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVELGlCQUFpQixDQUFDLE9BQWU7UUFDN0IsT0FBTyxPQUFPLEtBQUssSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFRCxLQUFLO1FBQ0YsT0FBTyxTQUFTLENBQUM7SUFDcEIsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLElBQUksbUJBQW1CLEVBQUU7YUFDckMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNwQixjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQzNCLGVBQWUsQ0FBQyxDQUFDLE1BQVUsRUFBRSxFQUFFLENBQ2hDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyxvQ0FBb0MsQ0FBQzthQUNwRCxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDYixnQkFBZ0IsQ0FBQyxDQUFDLE1BQVUsRUFBRSxFQUFFLENBQzdCLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyw2Q0FBNkMs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