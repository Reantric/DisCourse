import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
import * as db from "quick.db";
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageEmbed, Permissions } = require('discord.js');
let msgToHold: Discord.Message;

export default class buy implements IBotInteraction {

    private readonly aliases = ["buy"]

    name(): string {
        return "buy";
    } 

    help(): string {
        return "buy";
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
    perms(): "teacher" | "student" | "both" {
        return 'both';
     }

    async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {
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

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Some title')
            .setURL('https://discord.js.org/')
            .setDescription('Some description here');
        
        //console.log(interaction.fetchReply())
        msgToHold= await interaction.reply({ content: 'Shop for Permissions!', ephemeral: true, embeds: [embed], components: [row] });
        // setTimeout(() => {
        //     const row = new Discord.MessageActionRow()
        //     .addComponents(
        //         new Discord.MessageButton()
        //             .setCustomId('thing')
        //             .setLabel(`Finished`)
        //             .setStyle('DANGER')
        //             .setDisabled(true),
        //     );
        //     msgToHold.edit({ content: "You can no longer answer this question.", components: [row] });
    
        // },60*1000);
        
        
    const filter = (i: Discord.SelectMenuInteraction) => i.customId === 'shop';
    const collector: Discord.InteractionCollector<Discord.SelectMenuInteraction> = 
        interaction.channel!.createMessageComponentCollector(
            { filter, time: 60*1000 }
        );


    // var answered: Discord.Collection<string,boolean> = new Discord.Collection();
    collector.on('collect', async (i: Discord.SelectMenuInteraction) => {
    if(i.customId == 'shop'){
        i.deferUpdate();
        if(i.values[0]==='1'){
            if(db.get(`${i.user.id}.points`)-10>=0){
                db.subtract(`${i.user.id}.points`, 10)
                if(!interaction.guild.roles.cache.some((role: any) => role.name === role_name)){
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
            if(db.get(`${i.user.id}.points`)-10>=0){
                db.subtract(`${i.user.id}.points`, 10)
                if(!interaction.guild.roles.cache.some((role: any) => role.name === role_name)){
                    interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                        Permissions.FLAGS.CHANGE_NICKNAME
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
            if(db.get(`${i.user.id}.points`)-10>=0){
                db.subtract(`${i.user.id}.points`, 10)
                if(!interaction.guild.roles.cache.some((role: any) => role.name === role_name)){
                    interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                        Permissions.FLAGS.CHANGE_NICKNAME
                    ] })
                    .then((role:any) => {
                        interaction.guild.roles.fetch(role.id)
                        interaction.member.roles.add([role])});
                        i.followUp({content: `You can now use external emotes with the ${role_name} role.`, ephemeral:true})
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
            if(db.get(`${i.user.id}.points`)-10>=0){
                db.subtract(`${i.user.id}.points`, 10)
                if(!interaction.guild.roles.cache.some((role: any) => role.name === role_name)){
                    interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                        Permissions.FLAGS.CHANGE_NICKNAME
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
            if(db.get(`${i.user.id}.points`)-100>=0){
                db.subtract(`${i.user.id}.points`, 100)
                if(!interaction.guild.roles.cache.some((role: any) => role.name === role_name)){
                    interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                        Permissions.FLAGS.CHANGE_NICKNAME
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
            if(db.get(`${i.user.id}.points`)-999999>=0){
                db.subtract(`${i.user.id}.points`, 999999)
                if(!interaction.guild.roles.cache.some((role: any) => role.name === role_name)){
                    interaction.guild.roles.create({ name: role_name, color: color1, permissions: [
                        Permissions.FLAGS.CHANGE_NICKNAME
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