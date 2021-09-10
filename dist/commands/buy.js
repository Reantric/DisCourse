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
const db = require("quick.db");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageEmbed, Permissions } = require('discord.js');
let msgToHold;
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
            .addStringOption((option) => option.setName('role_name').setDescription('Enter a name for your custom role!').setRequired(true))
            .addStringOption((option) => option.setName('color').setDescription('Enter a solid color').setRequired(true));
    }
    perms() {
        return 'both';
    }
    runCommand(interaction, Bot) {
        return __awaiter(this, void 0, void 0, function* () {
            const role_name = interaction.options.getString('role_name');
            const color1 = interaction.options.getString('color').toUpperCase();
            const row = new MessageActionRow()
                .addComponents(new MessageSelectMenu()
                .setCustomId('shop')
                .setPlaceholder('Select a new custom permission!')
                .addOptions([
                {
                    label: 'Nickname Control',
                    description: 'Make sure you make your nickname school appropriate.',
                    value: '1',
                },
                {
                    label: 'Attaching Images and Files',
                    description: 'Send images and files in chat.',
                    value: '2',
                },
                {
                    label: 'External Emotes',
                    description: 'Only get this if you have Discord Nitro',
                    value: '3',
                },
                {
                    label: 'Embed Links',
                    description: 'Send links, such as YouTube or TikTok videos',
                    value: '4',
                },
                {
                    label: 'Text-to-Speech',
                    description: 'An expensive one. Use it wisely.',
                    value: '5',
                },
                {
                    label: 'Administrative Permissions',
                    description: 'Yeah, you\'re not reaching this one.',
                    value: '6',
                },
            ]));
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Some title')
                .setURL('https://discord.js.org/')
                .setDescription('Some description here');
            msgToHold = yield interaction.reply({ content: 'Shop for Permissions!', ephemeral: true, embeds: [embed], components: [row] });
            const filter = (i) => i.customId === 'shop';
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60 * 1000 });
            collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                if (i.customId == 'shop') {
                    i.deferUpdate();
                    if (i.values[0] === '1') {
                        if (db.get(`${i.user.id}.points`) - 10 >= 0) {
                            db.subtract(`${i.user.id}.points`, 10);
                            if (!interaction.guild.roles.cache.some((role) => role.name === role_name)) {
                                interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                                        Permissions.FLAGS.CHANGE_NICKNAME
                                    ] })
                                    .then((role) => {
                                    interaction.guild.roles.fetch(role.id);
                                    interaction.member.roles.add([role]);
                                });
                                i.followUp({ content: `You can now change your nickname with the ${role_name} role.`, ephemeral: true });
                            }
                            else {
                                i.followUp({ content: 'This role name already exists!', ephemeral: true });
                            }
                        }
                        else {
                            i.followUp({ content: 'You don\'t have enough money to buy this!', ephemeral: true });
                        }
                    }
                    if (i.values[0] === '2') {
                        if (db.get(`${i.user.id}.points`) - 10 >= 0) {
                            db.subtract(`${i.user.id}.points`, 10);
                            if (!interaction.guild.roles.cache.some((role) => role.name === role_name)) {
                                interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                                        Permissions.FLAGS.CHANGE_NICKNAME
                                    ] })
                                    .then((role) => {
                                    interaction.guild.roles.fetch(role.id);
                                    interaction.member.roles.add([role]);
                                });
                                i.followUp({ content: `You can now upload media and files with the ${role_name} role.`, ephemeral: true });
                            }
                            else {
                                i.followUp({ content: 'This role name already exists!', ephemeral: true });
                            }
                        }
                        else {
                            i.followUp({ content: 'You don\'t have enough money to buy this!', ephemeral: true });
                        }
                    }
                    if (i.values[0] === '3') {
                        if (db.get(`${i.user.id}.points`) - 10 >= 0) {
                            db.subtract(`${i.user.id}.points`, 10);
                            if (!interaction.guild.roles.cache.some((role) => role.name === role_name)) {
                                interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                                        Permissions.FLAGS.CHANGE_NICKNAME
                                    ] })
                                    .then((role) => {
                                    interaction.guild.roles.fetch(role.id);
                                    interaction.member.roles.add([role]);
                                });
                                i.followUp({ content: `You can now use external emotes with the ${role_name} role.`, ephemeral: true });
                            }
                            else {
                                i.followUp({ content: 'This role name already exists!', ephemeral: true });
                            }
                        }
                        else {
                            i.followUp({ content: 'You don\'t have enough money to buy this!', ephemeral: true });
                        }
                    }
                    if (i.values[0] === '4') {
                        if (db.get(`${i.user.id}.points`) - 10 >= 0) {
                            db.subtract(`${i.user.id}.points`, 10);
                            if (!interaction.guild.roles.cache.some((role) => role.name === role_name)) {
                                interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                                        Permissions.FLAGS.CHANGE_NICKNAME
                                    ] })
                                    .then((role) => {
                                    interaction.guild.roles.fetch(role.id);
                                    interaction.member.roles.add([role]);
                                });
                                i.followUp({ content: `You can now send embedded links in chat with the ${role_name} role.`, ephemeral: true });
                            }
                            else {
                                i.followUp({ content: 'This role name already exists!', ephemeral: true });
                            }
                        }
                        else {
                            i.followUp({ content: 'You don\'t have enough money to buy this!', ephemeral: true });
                        }
                    }
                    if (i.values[0] === '5') {
                        if (db.get(`${i.user.id}.points`) - 100 >= 0) {
                            db.subtract(`${i.user.id}.points`, 100);
                            if (!interaction.guild.roles.cache.some((role) => role.name === role_name)) {
                                interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                                        Permissions.FLAGS.CHANGE_NICKNAME
                                    ] })
                                    .then((role) => {
                                    interaction.guild.roles.fetch(role.id);
                                    interaction.member.roles.add([role]);
                                });
                                i.followUp({ content: `You can now to the Text-to-Speech command with the ${role_name} role.`, ephemeral: true });
                            }
                            else {
                                i.followUp({ content: 'This role name already exists!', ephemeral: true });
                            }
                        }
                        else {
                            i.followUp({ content: 'You don\'t have enough money to buy this!', ephemeral: true });
                        }
                    }
                    if (i.values[0] === '6') {
                        if (db.get(`${i.user.id}.points`) - 999999 >= 0) {
                            db.subtract(`${i.user.id}.points`, 999999);
                            if (!interaction.guild.roles.cache.some((role) => role.name === role_name)) {
                                interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                                        Permissions.FLAGS.CHANGE_NICKNAME
                                    ] })
                                    .then((role) => {
                                    interaction.guild.roles.fetch(role.id);
                                    interaction.member.roles.add([role]);
                                });
                                i.followUp({ content: `You now have administrative permissions with the ${role_name} role.`, ephemeral: true });
                            }
                            else {
                                i.followUp({ content: 'This role name already exists!', ephemeral: true });
                            }
                        }
                        else {
                            i.followUp({ content: 'You don\'t have enough money to buy this!', ephemeral: true });
                        }
                    }
                }
            }));
        });
    }
}
exports.default = checkstrikes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2J1eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUVBLCtCQUErQjtBQUMvQixNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUMvRCxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNqRyxJQUFJLFNBQTBCLENBQUM7QUFFL0IsTUFBcUIsWUFBWTtJQUFqQztRQUVxQixZQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQTRPdEMsQ0FBQztJQTFPRyxJQUFJO1FBQ0EsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUNELGlCQUFpQixDQUFDLE9BQWU7UUFDN0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBQ0QsSUFBSTtRQUNBLE9BQU8sSUFBSSxtQkFBbUIsRUFBRTthQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDM0IsZUFBZSxDQUFDLENBQUMsTUFBVSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNuSSxlQUFlLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxD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
