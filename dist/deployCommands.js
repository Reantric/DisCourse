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
const discord_js_1 = require("discord.js");
const discord_js_2 = require("discord.js");
const rest_1 = require("@discordjs/rest");
const v10_1 = require("discord-api-types/v10");
const setup_1 = require("./setup");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
let events = [];
const command_cooldowns = new discord_js_1.Collection();
refreshCommands();
loadEvents(`${__dirname}/events`);
const rest = new rest_1.REST().setToken(process.env.TOKEN);
function updateCommandPermissions(rest) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function loadCommands(commandsPath) {
    let commands = new Map();
    let commandList = setup_1.setupInfo.commands;
    if (!commandList || (commandList).length == 0)
        return null;
    for (const commandName of commandList) {
        const CommandClass = require(`${commandsPath}/${commandName}`).default;
        const command = new CommandClass();
        commands.set(commandName, command);
    }
    return commands;
}
function sendCommands(commands) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let applicationCommands = yield rest.put(v10_1.Routes.applicationCommands(process.env.CLIENT_ID), {
                body: Array.from(commands.values()).map((command) => command.data().json())
            });
            return applicationCommands;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    });
}
function setCommandPermissions(applicationCommands, commandMap) {
    for (let command of applicationCommands) {
        let commandObject = commandMap.get(command.name);
        if (commandObject.perms() == 'both')
            continue;
        let acceptRole = commandObject.perms() == 'student' ? 'student' : 'teacher';
        let denyRole = commandObject.perms() == 'teacher' ? 'student' : 'teacher';
        const permissionData = [{
                id: acceptRole,
                type: discord_js_2.ApplicationCommandPermissionType.Role,
                permission: true,
            }, {
                id: denyRole,
                type: discord_js_2.ApplicationCommandPermissionType.Role,
                permission: false,
            }];
        command.permissions.add({
            permissions: permissionData,
            token: process.env.TOKEN
        });
    }
}
function refreshCommands() {
    return __awaiter(this, void 0, void 0, function* () {
        let commands = loadCommands(`${__dirname}/commands`);
        if (!commands)
            return;
        let commandObjects = yield sendCommands(commands);
        setCommandPermissions(commandObjects, commands);
    });
}
function loadEvents(commandsPath) {
    let eventList = setup_1.setupInfo.events;
    if (!eventList || eventList.length == 0)
        return;
    for (const eventName of eventList) {
        const EventsClass = require(`${commandsPath}/${eventName}`).default;
        const event = new EventsClass();
        events.push(event);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95Q29tbWFuZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZGVwbG95Q29tbWFuZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFJQSwyQ0FBbUQ7QUFFbkQsMkNBQXdHO0FBSXhHLDBDQUF1QztBQUN2QywrQ0FBK0M7QUFLL0MsbUNBQW9DO0FBRXBDLG1DQUE4QjtBQUU5QixJQUFBLGVBQU0sR0FBRSxDQUFDO0FBR1QsSUFBSSxNQUFNLEdBQWdCLEVBQUUsQ0FBQztBQUM3QixNQUFNLGlCQUFpQixHQUFRLElBQUksdUJBQVUsRUFBRSxDQUFDO0FBRWhELGVBQWUsRUFBRSxDQUFBO0FBQ2pCLFVBQVUsQ0FBQyxHQUFHLFNBQVMsU0FBUyxDQUFDLENBQUM7QUFFbEMsTUFBTSxJQUFJLEdBQVMsSUFBSSxXQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUMsQ0FBQztBQUkzRCxTQUFlLHdCQUF3QixDQUFDLElBQVU7O0lBR2xELENBQUM7Q0FBQTtBQUVELFNBQVMsWUFBWSxDQUFDLFlBQW9CO0lBQ3RDLElBQUksUUFBUSxHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ3ZELElBQUksV0FBVyxHQUFHLGlCQUFTLENBQUMsUUFBb0IsQ0FBQztJQUVqRCxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQztJQUUzRCxLQUFLLE1BQU0sV0FBVyxJQUFJLFdBQVcsRUFBRTtRQUNuQyxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsR0FBRyxZQUFZLElBQUksV0FBVyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDdkUsTUFBTSxPQUFPLEdBQUcsSUFBSSxZQUFZLEVBQXFCLENBQUM7UUFDdEQsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FD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