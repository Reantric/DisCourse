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
const discord_js_1 = require("discord.js");
const discord_js_2 = require("discord.js");
const discord_js_3 = require("discord.js");
const discord_js_4 = require("discord.js");
const setup_1 = require("./setup");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const { QuickDB } = require("quick.db");
const db = new QuickDB();
var userBehavior = db.table('user');
var questionId = db.table('id');
const botIntents = [
    discord_js_3.GatewayIntentBits.Guilds,
    discord_js_3.GatewayIntentBits.GuildMembers,
    discord_js_3.GatewayIntentBits.GuildMessages
];
const Bot = new discord_js_1.Client({ intents: botIntents });
let commands = [];
let events = [];
const command_cooldowns = new discord_js_2.Collection();
function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
const student = {
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
        let roleManager = guild.roles;
        let channelManager = guild.channels;
        yield roleManager.fetch();
        yield channelManager.fetch();
        yield ((_a = Bot.application) === null || _a === void 0 ? void 0 : _a.fetch());
        if (!roleManager.cache.some((role) => role.name === 'Teacher')) {
            yield roleManager.create({ name: 'Teacher', color: 'Yellow', permissions: [
                    discord_js_3.PermissionFlagsBits.Administrator
                ] });
        }
        if (!roleManager.cache.some((role) => role.name === 'Student')) {
            yield roleManager.create({ name: 'Student', color: 'Red', permissions: [
                    discord_js_3.PermissionFlagsBits.ViewChannel,
                    discord_js_3.PermissionFlagsBits.AddReactions,
                    discord_js_3.PermissionFlagsBits.Stream,
                    discord_js_3.PermissionFlagsBits.SendMessages,
                    discord_js_3.PermissionFlagsBits.SendMessagesInThreads,
                    discord_js_3.PermissionFlagsBits.EmbedLinks,
                    discord_js_3.PermissionFlagsBits.AttachFiles,
                    discord_js_3.PermissionFlagsBits.ReadMessageHistory,
                    discord_js_3.PermissionFlagsBits.Connect,
                    discord_js_3.PermissionFlagsBits.Speak,
                    discord_js_3.PermissionFlagsBits.CreatePublicThreads
                ] });
        }
        if (!roleManager.cache.some((role) => role.name === 'Mute')) {
            yield roleManager.create({ name: 'Mute', color: 'Green', permissions: [
                    discord_js_3.PermissionFlagsBits.ReadMessageHistory,
                    discord_js_3.PermissionFlagsBits.ViewChannel
                ] });
        }
        studentID = (_b = roleManager.cache.find(role => role.name == 'Student')) === null || _b === void 0 ? void 0 : _b.id;
        teacherID = (_c = roleManager.cache.find(role => role.name == 'Teacher')) === null || _c === void 0 ? void 0 : _c.id;
        console.log("before fetch");
        yield ((_d = Bot.guilds.cache.get(setup_1.setupInfo.guildID)) === null || _d === void 0 ? void 0 : _d.commands.fetch().then((collection) => {
            loadCommands(`${__dirname}/commands`, collection);
            loadEvents(`${__dirname}/events`);
        }));
        let teacherChannel = channelManager.cache.some((channel) => channel.id == 'teacher');
        if (!teacherChannel) {
            channelManager.create({
                name: 'teacher',
                type: discord_js_4.ChannelType.GuildText,
                topic: 'DisCourse will send you info here.',
                permissionOverwrites: [
                    {
                        id: studentID,
                        deny: discord_js_3.PermissionFlagsBits.ViewChannel,
                        type: discord_js_4.OverwriteType.Role
                    },
                    {
                        id: roleManager.everyone,
                        deny: discord_js_3.PermissionFlagsBits.ViewChannel,
                        type: discord_js_4.OverwriteType.Role
                    },
                    {
                        id: teacherID,
                        allow: [
                            discord_js_3.PermissionFlagsBits.SendMessages,
                            discord_js_3.PermissionFlagsBits.ViewChannel,
                            discord_js_3.PermissionFlagsBits.ViewAuditLog
                        ],
                        type: discord_js_4.OverwriteType.Role
                    },
                ]
            });
        }
        let annChannel = channelManager.cache.some((channel) => channel.name == 'announcements');
        if (!annChannel) {
            channelManager.create({
                name: 'announcements',
                type: discord_js_4.ChannelType.GuildText,
                topic: 'Messages from your teacher will go here!',
                permissionOverwrites: [
                    {
                        id: studentID,
                        deny: discord_js_3.PermissionFlagsBits.SendMessages,
                        allow: discord_js_3.PermissionFlagsBits.ViewChannel,
                        type: discord_js_4.OverwriteType.Role
                    },
                    {
                        id: teacherID,
                        allow: [
                            discord_js_3.PermissionFlagsBits.SendMessages,
                            discord_js_3.PermissionFlagsBits.ViewChannel
                        ],
                        type: discord_js_4.OverwriteType.Role
                    },
                    {
                        id: roleManager.everyone,
                        allow: discord_js_3.PermissionFlagsBits.ViewChannel,
                        type: discord_js_4.OverwriteType.Role
                    }
                ]
            });
        }
        return yield roleManager.fetch(teacherID);
    });
}
Bot.once("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("This bot is online!");
    Bot.user.setPresence({
        activities: [{
                name: 'educational videos.',
                type: discord_js_4.ActivityType.Watching
            }],
        status: 'online'
    });
    (_a = Bot.user) === null || _a === void 0 ? void 0 : _a.setUsername("DisCourse");
    questionId.set("id", 0);
    Bot.guilds.fetch().then(() => {
        Bot.guilds.cache.forEach((guild) => __awaiter(void 0, void 0, void 0, function* () {
            let teacherRole = yield init(guild);
            guild.members.fetch().then((collection) => {
                collection.forEach((member) => {
                    if (!db.has(member.id)) {
                        db.set(member.id, student);
                    }
                    if (!member.roles.cache.has(teacherID) && !member.roles.cache.has(studentID))
                        member.roles.add([teacherRole]);
                });
            });
        }));
    });
}));
Bot.on("guildMemberAdd", member => {
    if (!db.has(member.id)) {
        db.set(member.id, student);
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
    if (msg.channel.type == discord_js_4.ChannelType.DM) {
        msg.author.send(`Please talk to me on a server! This ensures more engagement and reliability.`);
        return;
    }
});
Bot.on("guildCreate", (guild) => __awaiter(void 0, void 0, void 0, function* () {
    let teacherRole = yield init(guild);
    guild.members.fetch().then((collection) => {
        collection.forEach((member) => {
            if (!db.has(member.id)) {
                db.set(member.id, student);
            }
            if (!member.roles.cache.has(teacherID) && !member.roles.cache.has(studentID))
                member.roles.add([teacherRole]);
        });
    });
}));
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
                if (!command_cooldowns.has(commandClass.name())) {
                    command_cooldowns.set(commandClass.name(), new discord_js_2.Collection());
                }
                const now = Date.now();
                const timestamps = command_cooldowns.get(commandClass.name());
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
    console.log("Function called");
    if (!setup_1.setupInfo.commands || setup_1.setupInfo.commands.length == 0)
        return;
    let commandDatas = [];
    for (const commandName of setup_1.setupInfo.commands) {
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
                    type: discord_js_4.ApplicationCommandPermissionType.Role,
                    permission: true,
                },
                {
                    id: complementxd,
                    type: discord_js_4.ApplicationCommandPermissionType.Role,
                    permission: false,
                },
            ];
            permCommand === null || permCommand === void 0 ? void 0 : permCommand.permissions.add({
                permissions,
                token: process.env.TOKEN
            });
        }
    }
    const sendCommands = (() => __awaiter(this, void 0, void 0, function* () {
        console.log("Running");
        try {
            console.log('Started refreshing application (/) commands.');
            console.log('Successfully reloaded application (/) commands.');
        }
        catch (error) {
            console.error(error);
        }
    }));
    sendCommands();
}
function loadEvents(commandsPath) {
    if (!setup_1.setupInfo.events || setup_1.setupInfo.events.length == 0)
        return;
    for (const eventName of setup_1.setupInfo.events) {
        const eventsClass = require(`${commandsPath}/${eventName}`).default;
        const event = new eventsClass();
        events.push(event);
    }
    console.log('done');
}
console.log('here');
Bot.login(process.env.TOKEN);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQThEO0FBSTlELDJDQUFtRDtBQUNuRCwyQ0FBb0U7QUFDcEUsMkNBQXdHO0FBVXhHLG1DQUFvQztBQUVwQyxtQ0FBOEI7QUFFOUIsSUFBQSxlQUFNLEdBQUUsQ0FBQztBQUVULE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsTUFBTSxFQUFFLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUV6QixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFaEMsTUFBTSxVQUFVLEdBQUc7SUFDZiw4QkFBaUIsQ0FBQyxNQUFNO0lBQ3hCLDhCQUFpQixDQUFDLFlBQVk7SUFDOUIsOEJBQWlCLENBQUMsYUFBYTtDQUNsQyxDQUFDO0FBQ0YsTUFBTSxHQUFHLEdBQVcsSUFBSSxtQkFBTSxDQUFDLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUM7QUFDdEQsSUFBSSxRQUFRLEdBQXNCLEVBQUUsQ0FBQztBQUNyQyxJQUFJLE1BQU0sR0FBZ0IsRUFBRSxDQUFDO0FBQzdCLE1BQU0saUJBQWlCLEdBQVEsSUFBSSx1QkFBVSxFQUFFLENBQUM7QUFFaEQsU0FBUyxPQUFPLENBQUMsR0FBVyxFQUFDLEdBQVc7SUFDcEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBQyxDQUFDLEdBQUcsR0FBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUM7QUFDckQsQ0FBQztBQUVELE1BQU0sT0FBTyxHQUFHO0lBQ1osU0FBUyxFQUFFLEVBQUU7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