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
const rest_1 = require("@discordjs/rest");
const v10_1 = require("discord-api-types/v10");
const setup_1 = require("./setup");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const rest = new rest_1.REST().setToken(process.env.TOKEN);
refreshCommands();
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
                body: Array.from(commands.values()).map((command) => command.data().toJSON())
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
        if (!commandObject)
            return;
        if (commandObject.perms() == 'both')
            continue;
        let acceptRole = commandObject.perms() == 'student' ? 'student' : 'teacher';
        let denyRole = commandObject.perms() == 'teacher' ? 'student' : 'teacher';
        const permissionData = [{
                id: acceptRole,
                type: discord_js_1.ApplicationCommandPermissionType.Role,
                permission: true,
            }, {
                id: denyRole,
                type: discord_js_1.ApplicationCommandPermissionType.Role,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95Q29tbWFuZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZGVwbG95Q29tbWFuZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSwyQ0FBOEQ7QUFFOUQsMENBQXVDO0FBQ3ZDLCtDQUErQztBQUsvQyxtQ0FBb0M7QUFFcEMsbUNBQThCO0FBRTlCLElBQUEsZUFBTSxHQUFFLENBQUM7QUFFVCxNQUFNLElBQUksR0FBUyxJQUFJLFdBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQU0sQ0FBQyxDQUFDO0FBRTNELGVBQWUsRUFBRSxDQUFDO0FBRWxCLFNBQVMsWUFBWSxDQUFDLFlBQW9CO0lBQ3RDLElBQUksUUFBUSxHQUFpQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ3ZELElBQUksV0FBVyxHQUFHLGlCQUFTLENBQUMsUUFBb0IsQ0FBQztJQUVqRCxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQztJQUUzRCxLQUFLLE1BQU0sV0FBVyxJQUFJLFdBQVcsRUFBRTtRQUNuQyxNQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsR0FBRyxZQUFZLElBQUksV0FBVyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDdkUsTUFBTSxPQUFPLEdBQUcsSUFBSSxZQUFZLEVBQXFCLENBQUM7UUFDdEQsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDdEM7SUFDRCxPQUFPLFFBQVEsQ0FBQztBQUNwQixDQUFDO0FBRUQsU0FBZSxZQUFZLENBQUMsUUFBc0M7O1FBQzlELElBQUk7WUFDQSxJQUFJLG1CQUFtQixHQUEwQixNQUFNLElBQUksQ0FBQyxHQUFHLENBQzNELFlBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVUsQ0FBQyxFQUNsRDtnQkFDSSxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNoRixDQUNvQixDQUFDO1lBQzFCLE9BQU8sbUJBQW1CLENBQUM7U0FDOUI7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNaLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckIsT0FBTyxFQUFFLENBQUM7U0FDYjtJQUNMLENBQUM7Q0FBQTtBQUVELFNBQVMscUJBQXFCLENBQUMsbUJBQXlDLEVBQUUsVUFBd0M7SUFDOUcsS0FBSyxJQUFJLE9BQU8sSUFBSSxtQkFBbUIsRUFBRTtRQUNyQyxJQUFJLGFBQWEsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsYUFBYTtZQUFFLE9BQU87UUFDM0IsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksTUFBTTtZQUFFLFNBQVM7UUFDOUMsSUFBSSxVQUFVLEdBQUcsYUFBYyxDQUFDLEtBQUssRUFBRSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDN0UsSUFBSSxRQUFRLEdBQUcsYUFBYyxDQUFDLEtBQUssRUFBRSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDM0UsTUFBTSxjQUFjLEdBQW9DLENBQUM7Z0JBQ2pELEVBQUUsRUFBRSxVQUFVO2dCQUNkLElBQUksRUFBRSw2Q0FBZ0MsQ0FBQyxJQUFJO2dCQUMzQyxVQUFVLEVBQUUsSUFBSTthQUNuQixFQUFFO2dCQUNDLEVBQUUsRUFBRSxRQUFRO2dCQUNaLElBQUksRUFBRSw2Q0FBZ0MsQ0FBQyxJQUFJO2dCQUMzQyxVQUFVLEVBQUUsS0FBSzthQUNwQixDQUFDLENBQUM7UUFFUCxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQztZQUNwQixXQUFXLEVBQUUsY0FBYztZQUMzQixLQUFLLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFNO1NBQzVCLENBQUMsQ0FBQztLQUNOO0FBQ0wsQ0FBQztBQUVELFNBQWUsZUFBZTs7UUFDMUIsSUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDLEdBQUcsU0FBUyxXQUFXLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsUUFBUTtZQUFFLE9BQU87UUFDdEIsSUFBSSxjQUFjLEdBQUcsTUFBTSxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbEQscUJBQXFCLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3BELENBQUM7Q0FBQSJ9