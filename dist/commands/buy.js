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
const { MessageActionRow, MessageSelectMenu, MessageEmbed, Permissions } = require('discord.js');
class buy {
    constructor() {
        this.aliases = ["buy"];
    }
    name() {
        return "buy";
    }
    help() {
        return "Buy new server permissions with custom role names!";
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
            const embed = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Shop')
                .setDescription('A marketplace for special roles!')
                .setThumbnail('https://cdn.discordapp.com/attachments/775700759869259779/885703618097983539/AKedOLQgG2F4XjLYwul4pevvcE9rrDtYeu-E7vHVl8Xf9gs900-c-k-c0x00ffffff-no-rj.png')
                .setTimestamp()
                .addFields({ name: 'Nickname Control', value: '10 points', inline: true }, { name: 'Attaching Images & Files', value: '10 points', inline: true }, { name: 'External Emotes', value: '10 points', inline: true }, { name: 'Embed Links', value: '10 points', inline: true }, { name: 'Text-to-Speech', value: '100 points', inline: true }, { name: 'Administrative Permissions', value: '999999 points', inline: true });
            interaction.reply({ content: 'Here are your choices:', ephemeral: true, embeds: [embed], components: [row] });
            setTimeout(() => {
                const row = new Discord.MessageActionRow()
                    .addComponents(new Discord.MessageButton()
                    .setCustomId('ting')
                    .setLabel(`Expired`)
                    .setStyle('DANGER')
                    .setDisabled(true));
                interaction.editReply({ content: "The shop has expired.", components: [row] });
            }, 20 * 1000);
            const filter = (i) => i.customId === 'shop';
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 20 * 1000 });
            collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                if (i.customId == 'shop') {
                    i.deferUpdate();
                    if (i.values[0] === '1') {
                        if (db.get(`${i.user.id}.points`) - 10 >= 0) {
                            if (!interaction.guild.roles.cache.some((role) => role.name === role_name)) {
                                db.subtract(`${i.user.id}.points`, 10);
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
                            if (!interaction.guild.roles.cache.some((role) => role.name === role_name)) {
                                db.subtract(`${i.user.id}.points`, 10);
                                interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                                        Permissions.FLAGS.ATTACH_FILES
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
                            if (!interaction.guild.roles.cache.some((role) => role.name === role_name)) {
                                db.subtract(`${i.user.id}.points`, 10);
                                interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                                        Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
                                        Permissions.FLAG.USE_EXTERNAL_STICKERS
                                    ] })
                                    .then((role) => {
                                    interaction.guild.roles.fetch(role.id);
                                    interaction.member.roles.add([role]);
                                });
                                i.followUp({ content: `You can now use external emojis and stickers with the ${role_name} role.`, ephemeral: true });
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
                            if (!interaction.guild.roles.cache.some((role) => role.name === role_name)) {
                                db.subtract(`${i.user.id}.points`, 10);
                                interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                                        Permissions.FLAGS.EMBED_LINKS
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
                            if (!interaction.guild.roles.cache.some((role) => role.name === role_name)) {
                                db.subtract(`${i.user.id}.points`, 100);
                                interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                                        Permissions.FLAGS.SEND_TTS_MESSAGES
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
                                db.subtract(`${i.user.id}.points`, 999999);
                                interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                                        Permissions.FLAGS.ADMINISTRATOR
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
exports.default = buy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2J1eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFzQztBQUV0QywrQkFBK0I7QUFDL0IsTUFBTSxFQUFFLG1CQUFtQixFQUFFLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDL0QsTUFBTSxFQUFFLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFakcsTUFBcUIsR0FBRztJQUF4QjtRQUVxQixZQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQThQdEMsQ0FBQztJQTVQRyxJQUFJO1FBQ0EsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLG9EQUFvRCxDQUFDO0lBQ2hFLENBQUM7SUFFRCxRQUFRO1FBQ0osT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBQ0QsaUJBQWlCLENBQUMsT0FBZTtRQUM3QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFDRCxJQUFJO1FBQ0EsT0FBTyxJQUFJLG1CQUFtQixFQUFFO2FBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDcEIsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUMzQixlQUFlLENBQUMsQ0FBQyxNQUFVLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsY0FBYyxDQUFDLG9DQUFvQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ25JLGVBQWUsQ0FBQyxDQUFDLE1BQVUsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FB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