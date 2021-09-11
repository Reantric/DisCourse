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
        return __awaiter(this, void 0, void 0, function* () {
            const marked = new Discord.Collection();
            let msgToHold;
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
                    .setColor('#FFFFFF')
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0ZW5kYW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9hdHRlbmRhbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXNDO0FBQ3RDLCtCQUErQjtBQUUvQixNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUUvRCxNQUFxQixVQUFVO0lBRTNCLElBQUk7UUFDQSxPQUFPLFlBQVksQ0FBQztJQUN4QixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sdUJBQXVCLENBQUM7SUFDbkMsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLENBQUMsQ0FBQztJQUNiLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxPQUFlO1FBQzdCLE9BQU8sT0FBTyxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBRUQsS0FBSztRQUNGLE9BQU8sU0FBUyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyxJQUFJLG1CQUFtQixFQUFFO2FBQ3JDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDcEIsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUMzQixlQUFlLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUNoQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQzthQUNwQixjQUFjLENBQUMsb0NBQW9DLENBQUM7YUFDcEQsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2IsZ0JBQWdCLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUM3QixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQzthQUNwQixjQUFjLENBQUMsNkNBQTZDLENBQUMsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFSyxVQUFVLENBQUMsV0FBdUMsRUFBRSxHQUFtQjs7WUFDekUsSUFBSSxZQUFZ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