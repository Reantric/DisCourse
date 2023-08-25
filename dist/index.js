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
const commandCooldowns = new discord_js_2.Collection();
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
    var _a, _b, _c;
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
        loadCommands(`${__dirname}/commands`);
        loadEvents(`${__dirname}/events`);
        let teacherChannel = channelManager.cache.some((channel) => channel.name == 'teacher');
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
            if (!guild.members.me.permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator))
                return;
            let teacherRole = yield init(guild);
            guild.members.fetch().then((collection) => {
                collection.forEach((member) => __awaiter(void 0, void 0, void 0, function* () {
                    if (!(yield db.has(member.id))) {
                        yield db.set(member.id, student);
                    }
                    if (!member.roles.cache.has(teacherID) && !member.roles.cache.has(studentID))
                        member.roles.add([teacherRole]);
                }));
            });
        }));
    });
}));
Bot.on("guildMemberAdd", (member) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(yield db.has(member.id))) {
        yield db.set(member.id, student);
    }
    var role = member.guild.roles.cache.find(role => role.name == "Student");
    member.roles.add(role);
}));
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
        collection.forEach((member) => __awaiter(void 0, void 0, void 0, function* () {
            if (!(yield db.has(member.id))) {
                yield db.set(member.id, student);
            }
            if (!member.roles.cache.has(teacherID) && !member.roles.cache.has(studentID))
                member.roles.add([teacherRole]);
        }));
    });
}));
function handleEvent(msg) {
    return __awaiter(this, void 0, void 0, function* () {
        let arr = yield db.get(`${msg.author.id}.messages`);
        if (arr.length < 10) {
            yield db.push(`${msg.author.id}.messages`, msg.content);
        }
        else {
            yield db.set(`${msg.author.id}.messages`, []);
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
        for (const commandClass of commands) {
            try {
                if (!commandClass.isThisInteraction(command)) {
                    continue;
                }
                if (!commandCooldowns.has(commandClass.name())) {
                    commandCooldowns.set(commandClass.name(), new discord_js_2.Collection());
                }
                const now = Date.now();
                const timestamps = commandCooldowns.get(commandClass.name());
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
    add(name, description, perms) {
        this.helpMap.set(name, [description, perms]);
    }
    get() {
        return this.helpMap;
    }
}
exports.HelpUtil = HelpUtil;
exports.helpUtil = new HelpUtil();
function loadCommands(commandsPath) {
    if (!setup_1.setupInfo.commands || setup_1.setupInfo.commands.length == 0)
        return;
    for (const commandName of setup_1.setupInfo.commands) {
        const commandsClass = require(`${commandsPath}/${commandName}`).default;
        const command = new commandsClass();
        commands.push(command);
        exports.helpUtil.add(command.name(), command.help(), command.perms());
    }
}
function loadEvents(commandsPath) {
    let eventList = setup_1.setupInfo.events;
    if (!eventList || eventList.length == 0)
        return [];
    for (const eventName of eventList) {
        const EventsClass = require(`${commandsPath}/${eventName}`).default;
        const event = new EventsClass();
        events.push(event);
    }
    return events;
}
Bot.login(process.env.TOKEN);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQW1GO0FBSW5GLDJDQUFtRDtBQUNuRCwyQ0FBb0U7QUFDcEUsMkNBQXdHO0FBT3hHLG1DQUFvQztBQUVwQyxtQ0FBOEI7QUFFOUIsSUFBQSxlQUFNLEdBQUUsQ0FBQztBQUVULE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsTUFBTSxFQUFFLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUV6QixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFaEMsTUFBTSxVQUFVLEdBQUc7SUFDZiw4QkFBaUIsQ0FBQyxNQUFNO0lBQ3hCLDhCQUFpQixDQUFDLFlBQVk7SUFDOUIsOEJBQWlCLENBQUMsYUFBYTtDQUNsQyxDQUFDO0FBQ0YsTUFBTSxHQUFHLEdBQVcsSUFBSSxtQkFBTSxDQUFDLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUM7QUFDdEQsSUFBSSxRQUFRLEdBQXNCLEVBQUUsQ0FBQztBQUNyQyxJQUFJLE1BQU0sR0FBZ0IsRUFBRSxDQUFDO0FBQzdCLE1BQU0sZ0JBQWdCLEdBQVEsSUFBSSx1QkFBVSxFQUFFLENBQUM7QUFFL0MsU0FBUyxPQUFPLENBQUMsR0FBVyxFQUFDLEdBQVc7SUFDcEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBQyxDQUFDLEdBQUcsR0FBQyxHQUFHLEdBQUMsQ0FBQyxDQUFDLEdBQUMsR0FBRyxDQUFDLENBQUM7QUFDckQsQ0FBQztBQUVELE1BQU0sT0FBTyxHQUFHO0lBQ1osU0FBUyxFQUFFLEVBQUU7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