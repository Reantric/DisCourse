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
exports.helpUtil = exports.HelpUtil = void 0;
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
const cooldowns = new Discord.Collection();
function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
const vals = {
    questions: [],
    points: 0,
    strikes: 0,
    messages: [],
    absences: 0
};
let studentID;
let teacherID;
function init(guild) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        yield guild.roles.fetch();
        yield guild.channels.fetch();
        yield ((_a = Bot.application) === null || _a === void 0 ? void 0 : _a.fetch());
        if (!guild.roles.cache.some((role) => role.name === 'Teacher')) {
            yield guild.roles.create({ name: 'Teacher', color: 'YELLOW', permissions: [
                    discord_js_1.Permissions.FLAGS.ADMINISTRATOR
                ] });
        }
        if (!guild.roles.cache.some((role) => role.name === 'Student')) {
            yield guild.roles.create({ name: 'Student', color: 'RED', permissions: [
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
        if (!guild.roles.cache.some((role) => role.name === 'Mute')) {
            yield guild.roles.create({ name: 'Mute', color: 'GREEN', permissions: [
                    discord_js_1.Permissions.FLAGS.READ_MESSAGE_HISTORY,
                    discord_js_1.Permissions.FLAGS.VIEW_CHANNEL
                ] });
        }
        studentID = (_b = guild.roles.cache.find(role => role.name == 'Student')) === null || _b === void 0 ? void 0 : _b.id;
        teacherID = (_c = guild.roles.cache.find(role => role.name == 'Teacher')) === null || _c === void 0 ? void 0 : _c.id;
        yield ((_d = Bot.guilds.cache.get('886326356072337438')) === null || _d === void 0 ? void 0 : _d.commands.fetch().then((col) => {
            loadCommands(`${__dirname}/commands`, col);
            loadEvents(`${__dirname}/events`);
        }));
        let teacherChannel = guild.channels.cache.some((channel) => channel.name == 'teacher');
        if (!teacherChannel)
            guild.channels.create('teacher', { type: 'GUILD_TEXT', topic: 'DisCourse will send you info here.', permissionOverwrites: [
                    {
                        id: studentID,
                        deny: discord_js_1.Permissions.FLAGS.VIEW_CHANNEL,
                        type: "role"
                    },
                    {
                        id: guild.roles.everyone,
                        deny: discord_js_1.Permissions.FLAGS.VIEW_CHANNEL,
                        type: "role"
                    },
                    {
                        id: teacherID,
                        allow: [discord_js_1.Permissions.FLAGS.SEND_MESSAGES, discord_js_1.Permissions.FLAGS.VIEW_CHANNEL]
                    },
                ] });
        let annChannel = guild.channels.cache.some((channel) => channel.name == 'announcements');
        if (!annChannel)
            guild.channels.create('announcements', { type: 'GUILD_TEXT', topic: 'Messages from your teacher will go here!', permissionOverwrites: [
                    {
                        id: studentID,
                        deny: discord_js_1.Permissions.FLAGS.SEND_MESSAGES,
                        allow: discord_js_1.Permissions.FLAGS.VIEW_CHANNEL
                    },
                    {
                        id: teacherID,
                        allow: [discord_js_1.Permissions.FLAGS.SEND_MESSAGES, discord_js_1.Permissions.FLAGS.VIEW_CHANNEL]
                    },
                    {
                        id: guild.roles.everyone,
                        allow: discord_js_1.Permissions.FLAGS.VIEW_CHANNEL,
                    }
                ] });
        return yield guild.roles.fetch(teacherID);
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
            let h1gh = yield init(guild);
            guild.members.fetch().then((collection) => {
                collection.forEach((member) => {
                    if (!db.has(member.id)) {
                        db.set(member.id, vals);
                    }
                    if (!member.roles.cache.has(teacherID) || !member.roles.cache.has(studentID))
                        member.roles.add([h1gh]);
                });
            });
        }));
    });
}));
Bot.on("guildMemberAdd", member => {
    if (!db.has(member.id)) {
        db.set(member.id, vals);
    }
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
class HelpUtil {
    constructor() {
        this.helpMap = new Map();
    }
    add(name, help, perms) {
        this.helpMap.set(name, [help, perms]);
    }
    get() {
        return this.helpMap;
    }
}
exports.HelpUtil = HelpUtil;
exports.helpUtil = new HelpUtil();
function loadCommands(commandsPath, allSlashCommands) {
    if (!Config.config.commands || Config.config.commands.length == 0)
        return;
    let commandDatas = [];
    for (const commandName of Config.config.commands) {
        const commandsClass = require(`${commandsPath}/${commandName}`).default;
        const command = new commandsClass();
        exports.helpUtil.add(command.name(), command.help(), command.perms());
        commands.push(command);
        commandDatas.push(command.data().toJSON());
        const permCommand = allSlashCommands.find((com) => com.name == command.name());
        let xd;
        let complementxd;
        switch (command.perms()) {
            case 'student':
                xd = studentID;
                complementxd = teacherID;
                break;
            case 'teacher':
                xd = teacherID;
                complementxd = studentID;
                break;
            default:
                xd = '';
                complementxd = '';
        }
        if (xd != '') {
            const permissions = [
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
            permCommand === null || permCommand === void 0 ? void 0 : permCommand.permissions.add({ permissions });
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXNDO0FBQ3RDLG1DQUFtQztBQUNuQyxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFHN0IsSUFBSSxZQUFZLEdBQUcsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hDLElBQUksR0FBRyxHQUFHLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QixNQUFNLFNBQVMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN4QyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDckgsTUFBTSxHQUFHLEdBQW1CLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0FBQ3JFLDJDQUF5QztBQUl6QywwQ0FBdUM7QUFDdkMsNkNBQThDO0FBRzlDLElBQUksUUFBUSxHQUFzQixFQUFFLENBQUM7QUFDckMsSUFBSSxNQUFNLEdBQWdCLEVBQUUsQ0FBQztBQUs3QixNQUFNLFNBQVMsR0FBUSxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUdoRCxTQUFTLE9BQU8sQ0FBQyxHQUFXLEVBQUMsR0FBVztJQUVoQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFDLENBQUMsR0FBRyxHQUFDLEdBQUcsR0FBQyxDQUFDLENBQUMsR0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6RCxDQUFD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