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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const marked = new Discord.Collection();
            let msgToHold;
            const row = new Discord.MessageActionRow()
                .addComponents(new Discord.MessageButton()
                .setCustomId('attend')
                .setLabel(`I'm here!`)
                .setStyle('PRIMARY'));
            const channel = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.find((channel) => channel.name == 'announcements');
            msgToHold = yield channel.send({ content: `Click here to mark yourself present! \n <@&${role.id}>`, components: [row] });
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
                    if (!i.member.roles.cache.has(role.id)) {
                        i.followUp({ content: "You aren't a student!", ephemeral: true });
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
                var _b, _c;
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
                    .setColor('#FFFFFF')
                    .setTitle('Absent Students!')
                    .setDescription('These people did not mark themselves present!')
                    .setThumbnail('https://i.pinimg.com/originals/80/fd/eb/80fdeb47d44130603f5a2e440c421a66.jpg');
                allRoleUsers.forEach((member) => {
                    ailunicEmbed.addField(`${member.displayName}#${member.user.discriminator}`, `${db.get(`${member.id}.absences`)} absence(s)`);
                });
                ailunicEmbed.setTimestamp()
                    .setFooter('Report!', `${(_b = Bot.user) === null || _b === void 0 ? void 0 : _b.avatarURL}`);
                const channel = (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.channels.cache.find((channel) => channel.name == 'teacher');
                channel.send({ embeds: [ailunicEmbed] });
            }));
        });
    }
}
exports.default = attendance;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0ZW5kYW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9hdHRlbmRhbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXNDO0FBQ3RDLCtCQUErQjtBQUUvQixNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUUvRCxNQUFxQixVQUFVO0lBRTNCLElBQUk7UUFDQSxPQUFPLFlBQVksQ0FBQztJQUN4QixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sdUJBQXVCLENBQUM7SUFDbkMsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxPQUFlO1FBQzdCLE9BQU8sT0FBTyxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRUQsS0FBSztRQUNGLE9BQU8sU0FBUyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyxJQUFJLG1CQUFtQixFQUFFO2FBQ3JDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDcEIsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUMzQixlQUFlLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQzthQUNwQixjQUFjLENBQUMsb0NBQW9DLENBQUM7YUFDcEQsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2IsZ0JBQWdCLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUM3QixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQzthQUNwQixjQUFjLENBQUMsNkNBQTZDLENBQUMsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFSyxVQUFVLENBQUMsV0FBdUMsRUFBRSxHQUFtQjs7WUFDekUsSUFBSSxZQUFZ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