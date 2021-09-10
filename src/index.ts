import * as Discord from "discord.js";
import * as Config from "./config";
var db = require('quick.db');
import { IBotInteraction } from "./api/capi";
import { IBotEvent } from "./api/eapi";
var userBehavior = new db.table('user');
const myIntents = new Discord.Intents();
myIntents.add(Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MEMBERS,Discord.Intents.FLAGS.GUILD_MESSAGES);
const Bot: Discord.Client = new Discord.Client({intents: myIntents});
import { Permissions } from 'discord.js';


import fs = require('fs');
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
//Required imports

let commands: IBotInteraction[] = [];
let events: IBotEvent[] = [];


loadCommands(`${__dirname}/commands`)
loadEvents(`${__dirname}/events`)
//get all commands from directory name (arbitrary) and load them into commands which is of type IBotCommand

const cooldowns: any = new Discord.Collection();

//cooldowns is a object that takes a key-value pair and stores it in an array
function randint(min: number,max: number) // min and max included
{
        return Math.floor(Math.random()*(max-min+1)+min);
}

const vals = {
    questions: [],
    points:0,
    strikes:0,
    messages:[]
}

async function init(guild: Discord.Guild){
    await guild.roles.fetch();
    await guild.channels.fetch();

    if(!guild.roles.cache.some((role: any) => role.name === 'Teacher')){
        guild.roles.create({ name: 'Teacher', permissions: [
            Permissions.FLAGS.ADMINISTRATOR
        ] });
    }
    if(!guild.roles.cache.some((role: any) => role.name === 'Mute')){
        guild.roles.create({ name: 'Mute', permissions: [
            Permissions.FLAGS.READ_MESSAGE_HISTORY,
            Permissions.FLAGS.VIEW_CHANNEL
        ] });
    }
    if(!guild.roles.cache.some((role: any) => role.name === 'Student')){
        guild.roles.create({ name: 'Student', permissions: [
            Permissions.FLAGS.VIEW_CHANNEL,
            Permissions.FLAGS.ADD_REACTIONS,
            Permissions.FLAGS.STREAM,
            Permissions.FLAGS.SEND_MESSAGES,
            Permissions.FLAGS.EMBED_LINKS,
            Permissions.FLAGS.ATTACH_FILES,
            Permissions.FLAGS.READ_MESSAGE_HISTORY,
            Permissions.FLAGS.CONNECT,
            Permissions.FLAGS.SPEAK ,
            Permissions.FLAGS.USE_PUBLIC_THREADS,
        ] });
    }
    if(!guild.roles.cache.some((role: any) => role.name === 'Test')){
        guild.roles.create({ name: 'Test', permissions: [
            Permissions.FLAGS.READ_MESSAGE_HISTORY,
            Permissions.FLAGS.VIEW_CHANNEL
        ] });
    }
    //This is a WIP
    // Consider using a for loop in case we decide to add new roles!
    let teacherChannel = guild.channels.cache.some((channel) => channel.name == 'teacher');
    if (!teacherChannel)
        guild.channels.create('teacher', {type: 'GUILD_TEXT', topic: 'all hail h1gh!', permissionOverwrites:[
            {
                id: guild.roles.cache.find(role => role.name == 'Student') as Discord.Role,
                deny: Permissions.FLAGS.VIEW_CHANNEL,
                type: "role"
            },
            {
                id: guild.roles.everyone,
                deny: Permissions.FLAGS.VIEW_CHANNEL,
                type: "role"
            }
        ]});

    let annChannel = guild.channels.cache.some((channel) => channel.name == 'announcements');
    if (!annChannel)
        guild.channels.create('announcements', {type: 'GUILD_TEXT', topic: 'all hail h1gh!', permissionOverwrites:[
            {
                id: guild.roles.cache.find(role => role.name == 'Student') as Discord.Role,
                deny: Permissions.FLAGS.SEND_MESSAGES,
                allow: Permissions.FLAGS.VIEW_CHANNEL
            },
            {
                id: guild.roles.everyone,
                deny: Permissions.FLAGS.VIEW_CHANNEL,
            }
        ]});
}

Bot.once("ready", async () => {
    console.log("This bot is online!"); //standard protocol when starting up the bot
    Bot.user!.setPresence({ activities: [{ name: 'educational videos.', type:'WATCHING' }], status: 'online' });
    Bot.user?.setUsername("DisCourse");

    
    Bot.guilds.fetch().then(() => {
        Bot.guilds.cache.forEach(async (guild: Discord.Guild) => {
            init(guild);
            guild.members.fetch().then((collection) => {
                collection.forEach((member: Discord.GuildMember) => {
                    if (!db.has(member.id)){ //if User ID is not already in database (db) then add them, else do nothing
                        db.set(member.id,vals)
                    }
                })
            })
            
        })
    })
    })
    

Bot.on("guildMemberAdd", member => {
   if (!db.has(member.id)){ //if new member not in db, add them!
    db.set(member.id,vals)
   }
   console.log(member.user)
   var role: any = member.guild.roles.cache.find(role => role.id == "822258289814536203");
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

async function handleEvent(msg: Discord.Message){
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


function loadCommands(commandsPath: string){
    if (!Config.config.commands || (Config.config.commands as string[]).length == 0) return; //goes into config.ts and reads the commands, checks if they are valid
    
    let commandDatas: any[] = [];
    for (const commandName of Config.config.commands as string[]){ //turns commands in config.ts into a string array and iterates over them
        const commandsClass = require(`${commandsPath}/${commandName}`).default; //imports the command file (default=ts) from file directory

        const command = new commandsClass() as IBotInteraction; //command now follows same layout as IBotCommand in form commandsClass(), created new object
        commands.push(command); //adds commands to command array
        commandDatas.push(command.data().toJSON())
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