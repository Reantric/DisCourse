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
class announcement {
    constructor() {
        this.aliases = ["announcement"];
    }
    name() {
        return "announcement";
    }
    help() {
        return "announcement";
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
            .addSubcommand((subcommand) => subcommand
            .setName('signup')
            .setDescription('Give students the "Student" role'))
            .addSubcommand((subcommand) => subcommand
            .setName('announcement')
            .setDescription('Make an announcement')
            .addStringOption((option) => option.setName('topic').setDescription('Topic: ').setRequired(true))
            .addStringOption((option) => option.setName('body').setDescription('Body: ').setRequired(true)));
    }
    perms() {
        return 'teacher';
    }
    runCommand(interaction, Bot) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            var role = interaction.guild.roles.cache.find((role) => role.name == 'Student');
            const channel = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.find((channel) => channel.name == 'announcements');
            if (interaction.commandName === 'announcement') {
                if (interaction.options.getSubcommand() === 'signup') {
                    const row = new Discord.MessageActionRow()
                        .addComponents(new Discord.MessageButton()
                        .setCustomId(`signup`)
                        .setLabel(`I'm a Student`)
                        .setStyle('SUCCESS'));
                    interaction.reply({ content: "Creating sign-up...", ephemeral: true });
                    let embed = new Discord.MessageEmbed();
                    embed.setTitle("Students!")
                        .setColor("RANDOM")
                        .setDescription("Click the button to be given the student role so you can participate (valid for 5 days).")
                        .setTimestamp()
                        .setThumbnail(interaction.user.displayAvatarURL)
                        .setFooter(`Powered by DisCourse`);
                    let msgToHold;
                    channel.send({ embeds: [embed], components: [row] }).then((msg) => {
                        msgToHold = msg;
                    });
                    setTimeout(() => {
                        const row = new Discord.MessageActionRow()
                            .addComponents(new Discord.MessageButton()
                            .setCustomId('signup')
                            .setLabel(`Expired`)
                            .setStyle('SECONDARY')
                            .setDisabled(true));
                        msgToHold.edit({ content: `If you did not sign up, please contact your teacher.`, components: [row] });
                    }, 5 * 24 * 60 * 60 * 1000);
                    const filter = (i) => i.customId === 'signup';
                    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 5 * 24 * 60 * 60 * 1000 });
                    let num = 0;
                    collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                        if (i.customId == 'signup') {
                            i.deferUpdate();
                            if (i.member.roles.cache.has(role.id)) {
                                i.followUp({ content: "You are already a student!", ephemeral: true });
                            }
                            else {
                                i.followUp({ content: `You are now a student. Welcome to the class!`, ephemeral: true });
                                i.member.roles.add([role]);
                                num++;
                            }
                        }
                    }));
                    collector.on('end', () => __awaiter(this, void 0, void 0, function* () {
                        var _b;
                        const teachannel = (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.channels.cache.find((channel) => channel.name == 'announcements');
                        let announcementinfo = new Discord.MessageEmbed();
                        announcementinfo.setTitle("Student Sign-up")
                            .setDescription("Here's how many students signed up.")
                            .addField("Total:", num.toString())
                            .setColor("WHITE")
                            .setFooter(`Be sure to remind those who didn't sign up to do so or manually give them the student role.`)
                            .setTimestamp();
                        teachannel.send({ embeds: [announcementinfo] });
                    }));
                }
                else {
                    interaction.reply({ content: "Creating announcement...", ephemeral: true });
                    let embed = new Discord.MessageEmbed();
                    embed.setTitle("Announcement")
                        .setColor("RANDOM")
                        .setDescription("This is an important message from your teacher.")
                        .addField(interaction.options.getString("topic"), interaction.options.getString("body"))
                        .setThumbnail(interaction.user.displayAvatarURL)
                        .setTimestamp()
                        .setThumbnail(interaction.user.displayAvatarURL)
                        .setFooter(`Powered by DisCourse`);
                    channel.send({ content: `<@&${role.id}>`, embeds: [embed] });
                }
            }
        });
    }
}
exports.default = announcement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ub3VuY2VtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2Fubm91bmNlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFzQztBQUV0QyxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUcvRCxNQUFxQixZQUFZO0lBQWpDO1FBQ3FCLFlBQU8sR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBMkgvQyxDQUFDO0lBekhHLElBQUk7UUFDQSxPQUFPLGNBQWMsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sY0FBYyxDQUFDO0lBQzFCLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBQ0QsaUJBQWlCLENBQUMsT0FBZTtRQUM3QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFDRCxJQUFJO1FBQ0osT0FBTyxJQUFJLG1CQUFtQixFQUFFO2FBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDcEIsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUMzQixhQUFhLENBQUMsQ0FBQyxVQUFjLEVBQUUsRUFBRSxDQUNwQyxVQUFVO2FBQ1IsT0FBTyxDQUFDLFFBQVEsQ0FBQzthQUNqQixjQUFjLENBQUMsa0NBQWtDLENBQUMsQ0FBQzthQUNsRCxhQUFhLENBQUMsQ0FBQyxVQUFjLEVBQUUsRUFBRSxDQUNsQyxVQUFVO2FBQ0wsT0FBTyxDQUFDLGNBQWMsQ0FBQzthQUN2QixjQUFjLENBQUMsc0JBQXNCLENBQUM7YUFDdEMsZUFBZSxDQUFDLENBQUMsTUFBVyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsQ0FB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