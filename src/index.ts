import { Client, Guild, GuildMember } from 'discord.js';
import { RoleManager, GuildChannelManager } from 'discord.js';
import { ApplicationCommand, ApplicationCommandPermissions } from 'discord.js';
import { Interaction, CommandInteraction } from 'discord.js';
import { Snowflake, Collection } from 'discord.js';
import { PermissionFlagsBits, GatewayIntentBits } from 'discord.js';
import { ChannelType, OverwriteType, ActivityType, ApplicationCommandPermissionType } from 'discord.js';
import { RoleResolvable } from 'discord.js';
import { Message } from 'discord.js';

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

import { IBotInteraction } from "./api/capi";
import { IBotEvent } from "./api/eapi";

import { setupInfo } from './setup';

import {config} from 'dotenv';

config();

const { QuickDB } = require("quick.db");
const db = new QuickDB();

var userBehavior = db.table('user');
var question_id = db.table('id');

const botIntents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
];
const Bot: Client = new Client({intents: botIntents});
let commands: IBotInteraction[] = [];
let events: IBotEvent[] = [];
const command_cooldowns: any = new Collection();

function randint(min: number,max: number) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

const student = {
    questions: [],
    points:0,
    strikes:0,
    messages:[],
    absences:0
}

let studentID: string;
let teacherID: string;

/**
 * Setup bot in new server
 * @param guild
 * @returns 
 */
async function init(guild: Guild) {
    let roleManager: RoleManager = guild.roles;
    let channelManager: GuildChannelManager = guild.channels;

    //what does this do?
    // await roleManager.fetch();
    // await channelManager.fetch();
    // await Bot.application?.fetch();

    if (!roleManager.cache.some((role: any) => role.name === 'Teacher')) {
        await roleManager.create({ name: 'Teacher', color: 'Yellow', permissions: [
            PermissionFlagsBits.Administrator
        ]});
    }

    if (!roleManager.cache.some((role: any) => role.name === 'Student')) {
        await roleManager.create({ name: 'Student', color: 'Red', permissions: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.AddReactions,
            PermissionFlagsBits.Stream,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.SendMessagesInThreads,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.AttachFiles,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.Connect,
            PermissionFlagsBits.Speak ,
            PermissionFlagsBits.CreatePublicThreads
        ] });
    }

    if(!roleManager.cache.some((role: any) => role.name === 'Mute')){
        await roleManager.create({ name: 'Mute', color: 'Green', permissions: [
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.ViewChannel
        ] });
    }
    

    studentID = roleManager.cache.find(role => role.name == 'Student')?.id as string;
    teacherID = roleManager.cache.find(role => role.name == 'Teacher')?.id as string;
    await Bot.guilds.cache.get('886326356072337438')?.commands.fetch()
        .then((col: Collection<Snowflake, ApplicationCommand>) => {
        loadCommands(`${__dirname}/commands`,col);
        loadEvents(`${__dirname}/events`)
    })
    //This is a WIP
    // Consider using a for loop in case we decide to add new roles!
    let teacherChannel = channelManager.cache.some((channel) => channel.id == 'teacher');
    if (!teacherChannel) {
        channelManager.create({
        name: 'teacher', 
        type: ChannelType.GuildText, 
        topic: 'DisCourse will send you info here.', 
        permissionOverwrites: [
            {
                id: studentID,
                deny: PermissionFlagsBits.ViewChannel,
                type: OverwriteType.Role
            },
            {
                id: roleManager.everyone,
                deny: PermissionFlagsBits.ViewChannel,
                type: OverwriteType.Role
            },
            {
                id: teacherID,
                allow: [
                    PermissionFlagsBits.SendMessages, 
                    PermissionFlagsBits.ViewChannel, 
                    PermissionFlagsBits.ViewAuditLog
                ],
                type: OverwriteType.Role
            },
        ]});
    }

    let annChannel = channelManager.cache.some((channel) => channel.name == 'announcements');
    if (!annChannel) {
        channelManager.create({
        name: 'announcements',
        type: ChannelType.GuildText, 
        topic: 'Messages from your teacher will go here!', 
        permissionOverwrites: [
            {
                id: studentID,
                deny: PermissionFlagsBits.SendMessages,
                allow: PermissionFlagsBits.ViewChannel,
                type: OverwriteType.Role
            },
            {
                id: teacherID,
                allow: [
                    PermissionFlagsBits.SendMessages, 
                    PermissionFlagsBits.ViewChannel
                ],
                type: OverwriteType.Role
            },
            {
                id: roleManager.everyone,
                allow: PermissionFlagsBits.ViewChannel,
                type: OverwriteType.Role
            }
        ]
    });
    }
    
    return await roleManager.fetch(teacherID);
}

Bot.once("ready", async () => {
    console.log("This bot is online!");
    Bot.user!.setPresence({ 
        activities: [{ 
            name: 'educational videos.', 
            type: ActivityType.Watching 
        }], 
        status: 'online' });
    Bot.user?.setUsername("DisCourse");
    question_id.set("id", 0);
    
    Bot.guilds.fetch().then(() => {
        Bot.guilds.cache.forEach(async (guild: Guild) => {
            let teacherRole = await init(guild);
            guild.members.fetch().then((collection) => {
                collection.forEach((member: GuildMember) => {
                    if (!db.has(member.id)){ //if User ID is not already in database (db) then add them, else do nothing
                        db.set(member.id, student)
                    }
                    if (!member.roles.cache.has(teacherID) && !member.roles.cache.has(studentID))
                        member.roles.add([teacherRole as RoleResolvable]);
                })
            })
            
        })
    })
    })

Bot.on("guildMemberAdd", member => {
   if (!db.has(member.id)){ //if new member not in db, add them!
    db.set(member.id, student)
   }
   var role: any = member.guild.roles.cache.find(role => role.name == "Student");
   member.roles.add(role);
})

Bot.on("interactionCreate", async (interaction: Interaction) => {
	if (!interaction.isCommand()) return;
    handleCommand(interaction);
});

Bot.on("messageCreate", msg => {
    if (msg.author.bot) return;
    handleEvent(msg); // checks every message regardless of what it contains
    if (msg.channel.type == ChannelType.DM){
        msg.author.send(`Please talk to me on a server! This ensures more engagement and reliability.`);
        return;
    }
})

Bot.on("guildCreate",async guild => {
    let teacherRole = await init(guild);
    guild.members.fetch().then((collection) => {
        collection.forEach((member: GuildMember) => {
            if (!db.has(member.id)){ //if User ID is not already in database (db) then add them, else do nothing
                db.set(member.id, student)
            }
            if (!member.roles.cache.has(teacherID) && !member.roles.cache.has(studentID))
                member.roles.add([teacherRole as RoleResolvable]);
        })
    })
})

async function handleEvent(msg: Message){
    let arr=db.get(`${msg.author.id}.messages`)
    if (arr.length < 10){ // if not full
        db.push(`${msg.author.id}.messages`,msg.content);
    }
    else {
        db.set(`${msg.author.id}.messages`,[])
    }
    for (const eventClass of events){
        await eventClass.runEvent(msg,Bot);
    }
}

async function handleCommand(interaction: CommandInteraction){
    let command = interaction.commandName;
    let args: any = []//msg.content.split(" ").slice(1);
    //Make command and args lowercase

    for (const commandClass of commands){
        try {
            if (!commandClass.isThisInteraction(command) ){
                continue;
            } //Checks IBotCommands (located in api.ts) for layout, if isThisCommand String is not equal to command, skip!
            if (!command_cooldowns.has(commandClass.name())) { //if name String in capi.ts (IBotCommand) == to command
                command_cooldowns.set(commandClass.name(), new Collection()); //store the command name and a obj key-val 
            }
            
            const now = Date.now();
            const timestamps = command_cooldowns.get(commandClass.name()); //whatever is in the Discord.Collection, yeah thats timestamps now!
            const cooldownAmount = (commandClass.cooldown() || 3) * 1000; //from ms to sec
            //Begins the cooldown command process!
            if (timestamps.has(interaction.member?.user.id)) { //checks to see if user in col
                const expirationTime: number = timestamps.get(interaction.member?.user.id) + cooldownAmount; //expiration is time assigned to user + cooldownAmt
            
                if (now < expirationTime) { // This code is absolutely abysmal, my god a pizza pasta
                    const timeLeft = (expirationTime - now) / 1000;
                    if (timeLeft > 3600){
                        return interaction.reply({ephemeral: true, content: `please wait ${Math.round(timeLeft/3600)} more hour(s) before reusing the \`${commandClass.name()}\` command.`});
                    } else if (timeLeft > 60 && timeLeft < 3600){
                        return interaction.reply({ephemeral: true, content:`please wait ${Math.round(timeLeft/60)} more minute(s) before reusing the \`${commandClass.name()}\` command.`});
                    } else {
                    return interaction.reply({ephemeral: true, content:`please wait ${Math.round(timeLeft)} more second(s) before reusing the \`${commandClass.name()}\` command.`});
                } //if hours, run 1, if min, run2, else run3
            }
            }
            timestamps.set(interaction.member?.user.id, now); //user = key, time = val
            setTimeout(() => timestamps.delete(interaction.member?.user.id), cooldownAmount); //wait cooldownAmt!
            await commandClass.runCommand(interaction,Bot); //allows asynchronous operation and multithreading so multiple things can happen at once! also executes the cmd!
        }
        catch(e){
            console.log(e);
        }  //if error, log it!
    }
} 
export class HelpUtil {
    helpMap: Map<string,string[]>
    
    constructor(){
        this.helpMap = new Map();
    }

    add(name: string,help: string,perms: "student" | "teacher" | "both"){
        this.helpMap.set(name,[help,perms]);
    }

    get(){
        return this.helpMap;
    }
}

export const helpUtil = new HelpUtil();

function loadCommands(commandsPath: string, allSlashCommands: Collection<Snowflake, ApplicationCommand>){
    if (!setupInfo.commands || (setupInfo.commands as string[]).length == 0) return;
    
    let commandDatas: any[] = [];
    for (const commandName of setupInfo.commands as string[]) {
        const commandsClass = require(`${commandsPath}/${commandName}`).default;
        const command = new commandsClass() as IBotInteraction;
        helpUtil.add(command.name(),command.help(),command.perms());
        commands.push(command);
        commandDatas.push(command.data().toJSON())
        const permCommand = allSlashCommands.find((com) => com.name == command.name());
        let xd: string;
        let complementxd: string;
        switch (command.perms()) {
            case 'student':
                xd = studentID
                complementxd = teacherID;
                break;
            case 'teacher':
                xd = teacherID
                complementxd = studentID;
                break;
            default:
                xd = ''
                complementxd = ''
        }
        //console.log(xd,command.name(), command.perms());
        if (xd != ''){
            const permissions: ApplicationCommandPermissions[] = [
                {
                    id: xd,
                    type: ApplicationCommandPermissionType.Role,
                    permission: true,
                },
                {
                    id: complementxd,
                    type: ApplicationCommandPermissionType.Role,
                    permission: false,
                },
            ];

            permCommand?.permissions.add({
                permissions,
                token: process.env.TOKEN!
            });

        }
    }

    const rest: any = new REST({ version: '10' }).setToken(process.env.TOKEN!);

     (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID!, setupInfo.guildID),
                { body: commandDatas },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })(); 
}

function loadEvents(commandsPath: string){
    if (!setupInfo.events || (setupInfo.events as string[]).length == 0) return; 

    for (const eventName of setupInfo.events as string[]){ //turns events in config.ts into a string array and iterates over them
        const eventsClass = require(`${commandsPath}/${eventName}`).default; //imports the event file (default=ts) from file directory

        const event = new eventsClass() as IBotEvent; //command now follows same layout as IBotCommand in form commandsClass(), created new object
        events.push(event); //adds event to events array
    }
}

Bot.login(process.env.TOKEN!);