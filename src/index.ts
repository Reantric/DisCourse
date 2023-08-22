import { Client, Guild, GuildMember } from 'discord.js';
import { RoleManager, ChannelManager } from 'discord.js';
import { Snowflake, Collection, ApplicationCommand } from 'discord.js';
import { PermissionFlagsBits, GatewayIntentBits } from 'discord.js';
import { GuildChannelTypes } from 'discord.js';
import * as Config from "./config";
var db = require('quick.db');
import { IBotInteraction } from "./api/capi";
import { IBotEvent } from "./api/eapi";
var userBehavior = new db.table('user');
var qid = new db.table('id');

const myIntents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
];
const Bot: Client = new Client({intents: myIntents});

import fs = require('fs');
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
//Required imports

let commands: IBotInteraction[] = [];
let events: IBotEvent[] = [];
    
//get all commands from directory name (arbitrary) and load them into commands which is of type IBotCommand

const cooldowns: any = new Collection();

//cooldowns is a object that takes a key-value pair and stores it in an array
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
    let channelManager: ChannelManager = guild.channels;

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
    if (!teacherChannel)
        channelManager.create('teacher', {type: 'GUILD_TEXT', topic: 'DisCourse will send you info here.', 
        permissionOverwrites:[
            {
                id: studentID,
                deny: PermissionFlagsBits.ViewChannel,
                type: "role"
            },
            {
                id: roleManager.everyone,
                deny: PermissionFlagsBits.ViewChannel,
                type: "role"
            },
            {
                id: teacherID,
                allow: [
                    PermissionFlagsBits.SendMessages, 
                    PermissionFlagsBits.ViewChannel, 
                    PermissionFlagsBits.ViewAuditLog
                ]
            },
        ]});

    let annChannel = channelManager.cache.some((channel) => channel.name == 'announcements');
    if (!annChannel)
        channelManager.create('announcements', {type: 'GUILD_TEXT', topic: 'Messages from your teacher will go here!', permissionOverwrites:[
            {
                id: studentID,
                deny: PermissionFlagsBits.SEND_MESSAGES,
                allow: PermissionFlagsBits.VIEW_CHANNEL
            },
            {
                id: teacherID,
                allow: [PermissionFlagsBits.SEND_MESSAGES, PermissionFlagsBits.VIEW_CHANNEL]
            },
            {
                id: roleManager.everyone,
                allow: PermissionFlagsBits.VIEW_CHANNEL,
            }
        ]});
        return await roleManager.fetch(teacherID);
}

Bot.once("ready", async () => {
    console.log("This bot is online!"); //standard protocol when starting up the bot
    Bot.user!.setPresence({ activities: [{ name: 'educational videos.', type:'WATCHING' }], status: 'online' });
    Bot.user?.setUsername("DisCourse");
    qid.set("id", 0);
    
    Bot.guilds.fetch().then(() => {
        Bot.guilds.cache.forEach(async (guild: Guild) => {
            let h1gh = await init(guild);
            guild.members.fetch().then((collection) => {
                collection.forEach((member: GuildMember) => {
                    if (!db.has(member.id)){ //if User ID is not already in database (db) then add them, else do nothing
                        db.set(member.id,vals)
                    }
                    if (!member.roles.cache.has(teacherID) && !member.roles.cache.has(studentID))
                        member.roles.add([h1gh as Discord.RoleResolvable]);
                })
            })
            
        })
    })
    })

Bot.on("guildMemberAdd", member => {
   if (!db.has(member.id)){ //if new member not in db, add them!
    db.set(member.id,vals)
   }
   var role: any = member.roleManager.cache.find(role => role.name == "Student");
   member.roles.add(role);
})

Bot.on("interactionCreate", async (interaction: Discord.Interaction) => {
	if (!interaction.isCommand()) return;
    handleCommand(interaction);
});

Bot.on("messageCreate", msg => {
    if (msg.author.bot) return;
    handleEvent(msg); // checks every message regardless of what it contains
    if (msg.channel.type == 'DM'){
        msg.author.send(`Please talk to me on a server! This ensures more engagement and reliability.`);
        return;
    }
})

Bot.on("guildCreate",async guild => {
    let h1gh = await init(guild);
    guild.members.fetch().then((collection) => {
        collection.forEach((member: Discord.GuildMember) => {
            if (!db.has(member.id)){ //if User ID is not already in database (db) then add them, else do nothing
                db.set(member.id,vals)
            }
            if (!member.roles.cache.has(teacherID) && !member.roles.cache.has(studentID))
                member.roles.add([h1gh as Discord.RoleResolvable]);
        })
    })
})

async function handleEvent(msg: Discord.Message){
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

async function handleCommand(interaction: Discord.CommandInteraction){
    let command = interaction.commandName;
    let args: any = []//msg.content.split(" ").slice(1);
    //Make command and args lowercase

    for (const commandClass of commands){
        try {
            if (!commandClass.isThisInteraction(command) ){
                continue;
            } //Checks IBotCommands (located in api.ts) for layout, if isThisCommand String is not equal to command, skip!
            if (!cooldowns.has(commandClass.name())) { //if name String in capi.ts (IBotCommand) == to command
                cooldowns.set(commandClass.name(), new Discord.Collection()); //store the command name and a obj key-val 
            }
            
            const now = Date.now();
            const timestamps = cooldowns.get(commandClass.name()); //whatever is in the Discord.Collection, yeah thats timestamps now!
            const cooldownAmount = (commandClass.cooldown() || 3) * 1000; //from ms to sec
            //Begins the cooldown command process!
            if (timestamps.has(interaction.member?.user.id)) { //checks to see if user in col
                const expirationTime: number = timestamps.get(interaction.member?.user.id) + cooldownAmount; //expiration is time assigned to user + cooldownAmt
            
                if (now < expirationTime) { // This code is absolutely abysmal, my god
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

function loadCommands(commandsPath: string, allSlashCommands: Discord.Collection<Discord.Snowflake,Discord.ApplicationCommand>){
    if (!Config.config.commands || (Config.config.commands as string[]).length == 0) return; //goes into config.ts and reads the commands, checks if they are valid
    
    let commandDatas: any[] = [];
    for (const commandName of Config.config.commands as string[]){ //turns commands in config.ts into a string array and iterates over them
        const commandsClass = require(`${commandsPath}/${commandName}`).default; //imports the command file (default=ts) from file directory
        const command = new commandsClass() as IBotInteraction; //command now follows same layout as IBotCommand in form commandsClass(), created new object
        helpUtil.add(command.name(),command.help(),command.perms());
        commands.push(command); //adds commands to command array
        commandDatas.push(command.data().toJSON())
        const permCommand = allSlashCommands.find((com) => com.name == command.name());
        let xd: string;
        let complementxd: string;
        switch (command.perms()){
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
            const permissions: Discord.ApplicationCommandPermissionData[] = [
                {
                    id: xd,
                    type: 'ROLE',
                    permission: true,
                },
                {
                    id: complementxd,
                    type: 'ROLE',
                    permission: false,
                },
            ];

            permCommand?.permissions.add({permissions});

        }
    }

    const rest: any = new REST({ version: '9' }).setToken(Config.config.token);

     (async () => {
        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationGuildCommands(Config.config.clientID, Config.config.guildID),
                { body: commandDatas },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })(); 
}

function loadEvents(commandsPath: string){
    if (!Config.config.events || (Config.config.events as string[]).length == 0) return; 

    for (const eventName of Config.config.events as string[]){ //turns events in config.ts into a string array and iterates over them
        const eventsClass = require(`${commandsPath}/${eventName}`).default; //imports the event file (default=ts) from file directory

        const event = new eventsClass() as IBotEvent; //command now follows same layout as IBotCommand in form commandsClass(), created new object
        events.push(event); //adds event to events array
    }
}

Bot.login(Config.config.token); //logs in using token in config.config (not accessible to you)