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
const Config = require("./config");
var db = require('quick.db');
var userBehavior = new db.table('user');
var qid = new db.table('id');
const myIntents = new Discord.Intents();
myIntents.add(Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGES);
const Bot = new Discord.Client({ intents: myIntents });
const discord_js_1 = require("discord.js");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
let commands = [];
let events = [];
loadCommands(`${__dirname}/commands`);
loadEvents(`${__dirname}/events`);
const cooldowns = new Discord.Collection();
function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
const vals = {
    questions: [],
    points: 0,
    strikes: 0,
    messages: []
};
function init(guild) {
    return __awaiter(this, void 0, void 0, function* () {
        yield guild.roles.fetch();
        yield guild.channels.fetch();
        if (!guild.roles.cache.some((role) => role.name === 'Teacher')) {
            guild.roles.create({ name: 'Teacher', permissions: [
                    discord_js_1.Permissions.FLAGS.ADMINISTRATOR
                ] });
        }
        if (!guild.roles.cache.some((role) => role.name === 'Mute')) {
            guild.roles.create({ name: 'Mute', permissions: [
                    discord_js_1.Permissions.FLAGS.READ_MESSAGE_HISTORY,
                    discord_js_1.Permissions.FLAGS.VIEW_CHANNEL
                ] });
        }
        if (!guild.roles.cache.some((role) => role.name === 'Student')) {
            guild.roles.create({ name: 'Student', permissions: [
                    discord_js_1.Permissions.FLAGS.VIEW_CHANNEL,
                    discord_js_1.Permissions.FLAGS.ADD_REACTIONS,
                    discord_js_1.Permissions.FLAGS.STREAM,
                    discord_js_1.Permissions.FLAGS.SEND_MESSAGES,
                    discord_js_1.Permissions.FLAGS.EMBED_LINKS,
                    discord_js_1.Permissions.FLAGS.ATTACH_FILES,
                    discord_js_1.Permissions.FLAGS.READ_MESSAGE_HISTORY,
                    discord_js_1.Permissions.FLAGS.CONNECT,
                    discord_js_1.Permissions.FLAGS.SPEAK,
                    discord_js_1.Permissions.FLAGS.USE_PUBLIC_THREADS,
                ] });
        }
        if (!guild.roles.cache.some((role) => role.name === 'Test')) {
            guild.roles.create({ name: 'Test', permissions: [
                    discord_js_1.Permissions.FLAGS.READ_MESSAGE_HISTORY,
                    discord_js_1.Permissions.FLAGS.VIEW_CHANNEL
                ] });
        }
        let teacherChannel = guild.channels.cache.some((channel) => channel.name == 'teacher');
        if (!teacherChannel)
            guild.channels.create('teacher', { type: 'GUILD_TEXT', topic: 'all hail h1gh!', permissionOverwrites: [
                    {
                        id: guild.roles.cache.find(role => role.name == 'Student'),
                        deny: discord_js_1.Permissions.FLAGS.VIEW_CHANNEL,
                        type: "role"
                    },
                    {
                        id: guild.roles.everyone,
                        deny: discord_js_1.Permissions.FLAGS.VIEW_CHANNEL,
                        type: "role"
                    }
                ] });
        let annChannel = guild.channels.cache.some((channel) => channel.name == 'announcements');
        if (!annChannel)
            guild.channels.create('announcements', { type: 'GUILD_TEXT', topic: 'all hail h1gh!', permissionOverwrites: [
                    {
                        id: guild.roles.cache.find(role => role.name == 'Student'),
                        deny: discord_js_1.Permissions.FLAGS.SEND_MESSAGES,
                        allow: discord_js_1.Permissions.FLAGS.VIEW_CHANNEL
                    },
                    {
                        id: guild.roles.everyone,
                        deny: discord_js_1.Permissions.FLAGS.VIEW_CHANNEL,
                    }
                ] });
    });
}
Bot.once("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("This bot is online!");
    Bot.user.setPresence({ activities: [{ name: 'educational videos.', type: 'WATCHING' }], status: 'online' });
    (_a = Bot.user) === null || _a === void 0 ? void 0 : _a.setUsername("DisCourse");
    qid.set("id", 0);
    Bot.guilds.fetch().then(() => {
        Bot.guilds.cache.forEach((guild) => __awaiter(void 0, void 0, void 0, function* () {
            init(guild);
            guild.members.fetch().then((collection) => {
                collection.forEach((member) => {
                    if (!db.has(member.id)) {
                        db.set(member.id, vals);
                    }
                });
            });
        }));
    });
}));
Bot.on("guildMemberAdd", member => {
    if (!db.has(member.id)) {
        db.set(member.id, vals);
    }
    console.log(member.user);
    var role = member.guild.roles.cache.find(role => role.name == "Student");
    member.roles.add(role);
});
Bot.on("interactionCreate", (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand())
        return;
    handleCommand(interaction);
}));
Bot.on("messageCreate", msg => {
    if (msg.author.bot)
        return;
    handleEvent(msg);
    if (msg.channel.type == 'DM') {
        msg.author.send(`Please talk to me on a server! This ensures more engagement and reliability.`);
        return;
    }
});
function handleEvent(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        let arr = db.get(`${msg.author.id}.messages`);
        if (arr.length < 10) {
            db.push(`${msg.author.id}.messages`, msg.content);
        }
        else {
            db.set(`${msg.author.id}.messages`, []);
        }
        for (const eventClass of events) {
            yield eventClass.runEvent(msg, Bot);
        }
    });
}
function handleCommand(interaction) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let command = interaction.commandName;
        let args = [];
        for (const commandClass of commands) {
            try {
                if (!commandClass.isThisInteraction(command)) {
                    continue;
                }
                if (!cooldowns.has(commandClass.name())) {
                    cooldowns.set(commandClass.name(), new Discord.Collection());
                }
                const now = Date.now();
                const timestamps = cooldowns.get(commandClass.name());
                const cooldownAmount = (commandClass.cooldown() || 3) * 1000;
                if (timestamps.has((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id)) {
                    const expirationTime = timestamps.get((_b = interaction.member) === null || _b === void 0 ? void 0 : _b.user.id) + cooldownAmount;
                    if (now < expirationTime) {
                        const timeLeft = (expirationTime - now) / 1000;
                        if (timeLeft > 3600) {
                            return interaction.reply({ ephemeral: true, content: `please wait ${Math.round(timeLeft / 3600)} more hour(s) before reusing the \`${commandClass.name()}\` command.` });
                        }
                        else if (timeLeft > 60 && timeLeft < 3600) {
                            return interaction.reply({ ephemeral: true, content: `please wait ${Math.round(timeLeft / 60)} more minute(s) before reusing the \`${commandClass.name()}\` command.` });
                        }
                        else {
                            return interaction.reply({ ephemeral: true, content: `please wait ${Math.round(timeLeft)} more second(s) before reusing the \`${commandClass.name()}\` command.` });
                        }
                    }
                }
                timestamps.set((_c = interaction.member) === null || _c === void 0 ? void 0 : _c.user.id, now);
                setTimeout(() => { var _a; return timestamps.delete((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id); }, cooldownAmount);
                yield commandClass.runCommand(interaction, Bot);
            }
            catch (e) {
                console.log(e);
            }
        }
    });
}
function loadCommands(commandsPath) {
    if (!Config.config.commands || Config.config.commands.length == 0)
        return;
    let commandDatas = [];
    for (const commandName of Config.config.commands) {
        const commandsClass = require(`${commandsPath}/${commandName}`).default;
        const command = new commandsClass();
        commands.push(command);
        commandDatas.push(command.data().toJSON());
    }
    const rest = new rest_1.REST({ version: '9' }).setToken(Config.config.token);
    (() => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Started refreshing application (/) commands.');
            yield rest.put(v9_1.Routes.applicationGuildCommands(Config.config.clientID, Config.config.guildID), { body: commandDatas });
            console.log('Successfully reloaded application (/) commands.');
        }
        catch (error) {
            console.error(error);
        }
    }))();
}
function loadEvents(commandsPath) {
    if (!Config.config.events || Config.config.events.length == 0)
        return;
    for (const eventName of Config.config.events) {
        const eventsClass = require(`${commandsPath}/${eventName}`).default;
        const event = new eventsClass();
        events.push(event);
    }
}
Bot.login(Config.config.token);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBc0M7QUFDdEMsbUNBQW1DO0FBQ25DLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUc3QixJQUFJLFlBQVksR0FBRyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDeEMsSUFBSSxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLE1BQU0sU0FBUyxHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3hDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNySCxNQUFNLEdBQUcsR0FBbUIsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7QUFDckUsMkNBQXlDO0FBSXpDLDBDQUF1QztBQUN2Qyw2Q0FBOEM7QUFHOUMsSUFBSSxRQUFRLEdBQXNCLEVBQUUsQ0FBQztBQUNyQyxJQUFJLE1BQU0sR0FBZ0IsRUFBRSxDQUFDO0FBRzdCLFlBQVksQ0FBQyxHQUFHLFNBQVMsV0FBVyxDQUFDLENBQUE7QUFDckMsVUFBVSxDQUFDLEdBQUcsU0FBUyxTQUFTLENBQUMsQ0FBQTtBQUdqQyxNQUFNLFNBQVMsR0FBUSxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUdoRCxTQUFTLE9BQU8sQ0FBQyxHQUFXLEVBQUMsR0FBVztJQUVoQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFD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