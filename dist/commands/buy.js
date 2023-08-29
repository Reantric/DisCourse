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
const discord_js_1 = require("discord.js");
const discord_js_2 = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
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
            const embed = new discord_js_1.EmbedBuilder()
                .setColor('Random')
                .setTitle('Shop')
                .setDescription('A marketplace for special roles!')
                .setThumbnail('https://cdn.discordapp.com/attachments/775700759869259779/885703618097983539/AKedOLQgG2F4XjLYwul4pevvcE9rrDtYeu-E7vHVl8Xf9gs900-c-k-c0x00ffffff-no-rj.png')
                .setTimestamp()
                .addFields({ name: 'Nickname Control', value: '10 points', inline: true }, { name: 'Attaching Images & Files', value: '10 points', inline: true }, { name: 'External Emotes', value: '10 points', inline: true }, { name: 'Embed Links', value: '10 points', inline: true }, { name: 'Text-to-Speech', value: '100 points', inline: true }, { name: 'Administrative Permissions', value: '999999 points', inline: true });
            interaction.reply({ content: 'Here are your choices:', ephemeral: true, embeds: [embed], components: [row] });
            setTimeout(() => {
                const row = new discord_js_1.ActionRowBuilder()
                    .addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId('ting')
                    .setLabel(`Expired`)
                    .setStyle(discord_js_2.ButtonStyle.Danger)
                    .setDisabled(true));
                interaction.editReply({ content: "The shop has expired.", components: [row] });
            }, 20 * 1000);
            const filter = (i) => i.customId === 'shop';
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 20 * 1000 });
            collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                if (i.customId == 'shop') {
                    i.deferUpdate();
                    if (i.values[0] === '1') {
                        if ((yield db.get(`${i.user.id}.points`)) - 10 >= 0) {
                            if (!interaction.guild.roles.cache.some((role) => role.name === role_name)) {
                                yield db.sub(`${i.user.id}.points`, 10);
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
                        if ((yield db.get(`${i.user.id}.points`)) - 10 >= 0) {
                            if (!interaction.guild.roles.cache.some((role) => role.name === role_name)) {
                                yield db.sub(`${i.user.id}.points`, 10);
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
                        if ((yield db.get(`${i.user.id}.points`)) - 10 >= 0) {
                            if (!interaction.guild.roles.cache.some((role) => role.name === role_name)) {
                                yield db.sub(`${i.user.id}.points`, 10);
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
                        if ((yield db.get(`${i.user.id}.points`)) - 10 >= 0) {
                            if (!interaction.guild.roles.cache.some((role) => role.name === role_name)) {
                                yield db.sub(`${i.user.id}.points`, 10);
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
                        if ((yield db.get(`${i.user.id}.points`)) - 100 >= 0) {
                            if (!interaction.guild.roles.cache.some((role) => role.name === role_name)) {
                                yield db.sub(`${i.user.id}.points`, 100);
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
                        if ((yield db.get(`${i.user.id}.points`)) - 999999 >= 0) {
                            yield db.sub(`${i.user.id}.points`, 999999);
                            if (!interaction.guild.roles.cache.some((role) => role.name === role_name)) {
                                yield db.sub(`${i.user.id}.points`, 999999);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2J1eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLDJDQUFxSTtBQUNySSwyQ0FBaUQ7QUFHakQsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN4QyxNQUFNLEVBQUUsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQ3pCLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQy9ELE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBRWpHLE1BQXFCLEdBQUc7SUFBeEI7UUFFcUIsWUFBTyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7SUErUHRDLENBQUM7SUE3UEcsSUFBSTtRQUNBLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyxvREFBb0QsQ0FBQztJQUNoRSxDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVELGlCQUFpQixDQUFDLE9BQWU7UUFDN0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sSUFBSSxtQkFBbUIsRUFBRTthQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3BCLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDM0IsZUFBZSxDQUFDLENBQUMsTUFBVSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDLFdB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