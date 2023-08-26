import { Embed, EmbedBuilder, InteractionCollector, StringSelectMenuInteraction, ActionRowBuilder, ButtonBuilder } from "discord.js";
import { Client, ButtonStyle } from "discord.js";
import { IBotInteraction } from "../api/capi";
import { CommandAccess } from "../types";
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageEmbed, Permissions } = require('discord.js');

export default class buy implements IBotInteraction {

    private readonly aliases = ["buy"]

    name(): string {
        return "buy";
    } 

    help(): string {
        return "Buy new server permissions with custom role names!";
    }
    
    cooldown(): number{
        return 2;
    }

    isThisInteraction(command: string): boolean {
        return this.aliases.includes(command);
    }

    data(): any {
        return new SlashCommandBuilder()
        .setName(this.name())
        .setDescription(this.help())
        .addStringOption((option:any) => option.setName('role_name').setDescription('Enter a name for your custom role!').setRequired(true))
        .addStringOption((option:any) => option.setName('color').setDescription('Enter a solid color').setRequired(true));
    }
    perms(): CommandAccess {
        return 'both';
     }

    async runCommand(interaction: any, Bot: Client): Promise<void> {
        const role_name = interaction.options.getString('role_name');
        const color1 = interaction.options.getString('color').toUpperCase();
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
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
                    ]),
            );
        const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle('Shop')
            .setDescription('A marketplace for special roles!')
            .setThumbnail('https://cdn.discordapp.com/attachments/775700759869259779/885703618097983539/AKedOLQgG2F4XjLYwul4pevvcE9rrDtYeu-E7vHVl8Xf9gs900-c-k-c0x00ffffff-no-rj.png')
            .setTimestamp()
            .addFields(
                { name: 'Nickname Control', value: '10 points', inline:true },
                { name: 'Attaching Images & Files', value: '10 points', inline: true },
                { name: 'External Emotes', value: '10 points', inline: true },
                { name: 'Embed Links', value: '10 points', inline: true },
                { name: 'Text-to-Speech', value: '100 points', inline: true },
                { name: 'Administrative Permissions', value: '999999 points', inline: true }
            )    ;   
        
        //console.log(interaction.fetchReply())
         interaction.reply({ content: 'Here are your choices:', ephemeral: true, embeds: [embed], components: [row] });
         setTimeout(() => {
            const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ting')
                    .setLabel(`Expired`)
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true),
            );
            interaction.editReply({ content: "The shop has expired.", components: [row] });
        },20*1000);
        
        
    const filter = (i: StringSelectMenuInteraction) => i.customId === 'shop';
    const collector: InteractionCollector<StringSelectMenuInteraction> = 
        interaction.channel!.createMessageComponentCollector(
            { filter, time: 20*1000 }
        );


    // var answered: Discord.Collection<string,boolean> = new Discord.Collection();
    collector.on('collect', async (i: StringSelectMenuInteraction) => {
    if(i.customId == 'shop'){
        i.deferUpdate();
        if(i.values[0]==='1'){
            if(await db.get(`${i.user.id}.points`)-10>=0){
                
                if(!interaction.guild.roles.cache.some((role: any) => role.name === role_name)){
                    await db.sub(`${i.user.id}.points`, 10)
                    interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                        Permissions.FLAGS.CHANGE_NICKNAME
                    ] })
                    .then((role:any) => {
                        interaction.guild.roles.fetch(role.id)
                        interaction.member.roles.add([role])});

                    i.followUp({content: `You can now change your nickname with the ${role_name} role.`, ephemeral:true})
                }
                else{
                    i.followUp({content: 'This role name already exists!', ephemeral:true})
                }
                
                }
            else{
                i.followUp({content: 'You don\'t have enough money to buy this!', ephemeral:true})
            }
            
        }
        if(i.values[0]==='2'){
            if(await db.get(`${i.user.id}.points`)-10>=0){
                
                if(!interaction.guild.roles.cache.some((role: any) => role.name === role_name)){
                    await db.sub(`${i.user.id}.points`, 10)
                    interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                        Permissions.FLAGS.ATTACH_FILES
                    ] })
                    .then((role:any) => {
                        interaction.guild.roles.fetch(role.id)
                        interaction.member.roles.add([role])});
                i.followUp({content: `You can now upload media and files with the ${role_name} role.`, ephemeral:true})
                }
                else{
                    i.followUp({content: 'This role name already exists!', ephemeral:true})
                }
            }
            else{
                i.followUp({content: 'You don\'t have enough money to buy this!', ephemeral:true})
            }
            
        }
        if(i.values[0]==='3'){
            if(await db.get(`${i.user.id}.points`)-10>=0){
                
                if(!interaction.guild.roles.cache.some((role: any) => role.name === role_name)){
                    await db.sub(`${i.user.id}.points`, 10)
                    interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                        Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
                        Permissions.FLAG. USE_EXTERNAL_STICKERS
                    ] })
                    .then((role:any) => {
                        interaction.guild.roles.fetch(role.id)
                        interaction.member.roles.add([role])});
                    i.followUp({content: `You can now use external emojis and stickers with the ${role_name} role.`, ephemeral:true})
                }
                else{
                    i.followUp({content: 'This role name already exists!', ephemeral:true})
                }
                
                }
                else{
                    i.followUp({content: 'You don\'t have enough money to buy this!', ephemeral:true})
                }
            
        }
        if(i.values[0]==='4'){
            if(await db.get(`${i.user.id}.points`)-10>=0){
                
                if(!interaction.guild.roles.cache.some((role: any) => role.name === role_name)){
                    await db.sub(`${i.user.id}.points`, 10)
                    interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                        Permissions.FLAGS.EMBED_LINKS
                    ] })
                    .then((role:any) => {
                        interaction.guild.roles.fetch(role.id)
                        interaction.member.roles.add([role])});
                    i.followUp({content: `You can now send embedded links in chat with the ${role_name} role.`, ephemeral:true})
                }
                else{
                    i.followUp({content: 'This role name already exists!', ephemeral:true})
                }
                }
                else{
                    i.followUp({content: 'You don\'t have enough money to buy this!', ephemeral:true})
                }
            
        }
        if(i.values[0]==='5'){
            if(await db.get(`${i.user.id}.points`)-100>=0){
               
                if(!interaction.guild.roles.cache.some((role: any) => role.name === role_name)){
                    await db.sub(`${i.user.id}.points`, 100)
                    interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                        Permissions.FLAGS.SEND_TTS_MESSAGES
                    ] })
                    .then((role:any) => {
                        interaction.guild.roles.fetch(role.id)
                        interaction.member.roles.add([role])});
                        i.followUp({content: `You can now to the Text-to-Speech command with the ${role_name} role.`, ephemeral:true})
                }
                else{
                    i.followUp({content: 'This role name already exists!', ephemeral:true})
                }
                
                }
                else{
                    i.followUp({content: 'You don\'t have enough money to buy this!', ephemeral:true})
                }
            
        }
        if(i.values[0]==='6'){
            if(await db.get(`${i.user.id}.points`)-999999>=0){
                await db.sub(`${i.user.id}.points`, 999999)
                if(!interaction.guild.roles.cache.some((role: any) => role.name === role_name)){
                    await db.sub(`${i.user.id}.points`, 999999)
                    interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                        Permissions.FLAGS.ADMINISTRATOR
                    ] })
                    .then((role:any) => {
                        interaction.guild.roles.fetch(role.id)
                        interaction.member.roles.add([role])});
                        i.followUp({content: `You now have administrative permissions with the ${role_name} role.`, ephemeral:true})
                }

                else{
                    i.followUp({content: 'This role name already exists!', ephemeral:true})
                }
                }
                else{
                    i.followUp({content: 'You don\'t have enough money to buy this!', ephemeral:true})
                }
            
        }


    }
    });
}
    
}