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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQW1GO0FBSW5GLDJDQUFtRDtBQUNuRCwyQ0FBb0U7QUFDcEUsMkNBQXdHO0FBT3hHLG1DQUFvQztBQUVwQyxtQ0FBOEI7QUFFOUIsSUFBQSxlQUFNLEdBQUUsQ0FBQztBQUVULE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDeEMsTUFBTSxFQUFFLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUV6QixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFaEMsTUFBTSxVQUFVLEdBQUc7SUFDZiw4QkFBaUIsQ0FBQyxNQUFNO0lBQ3hCLDhCQUFpQixDQUFDLFlBQVk7SUFDOUIsOEJBQWlCLENBQUMsYUFBYTtDQUNsQyxDQUFDO0FBQ0YsTUFBTSxHQUFHLEdBQVcsSUFBSSxtQkFBTSxDQUFDLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUM7QUFDdEQsSUFBSSxRQUFRLEdBQXNCLEVBQUUsQ0FBQztBQUNyQyxJQUFJLE1BQU0sR0FBZ0IsRUFBRSxDQUFDO0FBQzdCLE1BQU0sZ0JBQWdCLEdBQVEsSUFBSSx1QkFBVSxFQUFFLENBQUM7QUFFL0MsTUFBTSxPQUFPLEdBQUc7SUFDWixTQUFTLEVBQUUsRUFBRTtJQUNiLE1BQU0sRUFBQyxDQUFDO0lBQ1IsT0FBTyxFQUFDLENBQUM7SUFDVCxRQUFRLEVBQUMsRUFBRTtJQUNYLFFBQVEsRUFBQyxDQUFDO0NBQ2IsQ0FBQTtBQUVELElBQUksU0FBaUIsQ0FBQztBQUN0QixJQUFJLFNBQWlCLENBQUM7QUFPdEIsU0FBZSxJQUFJLENBQUMsS0FB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