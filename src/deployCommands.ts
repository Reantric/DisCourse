import { Client, Guild, GuildMember, PermissionsBitField, Role } from 'discord.js';
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


let events: IBotEvent[] = [];
const command_cooldowns: any = new Collection();

refreshCommands()
loadEvents(`${__dirname}/events`);

const rest: REST = new REST().setToken(process.env.TOKEN!);

// updateCommandPermissions(rest);

async function updateCommandPermissions(rest: REST) {
    // const commandInformation = await rest.get(Routes.applicationCommandPermissions(process.env.CLIENT_ID!, setupInfo.guildID));
    // console.log(commandInformation);
}

function loadCommands(commandsPath: string): Map<string, IBotInteraction> | null {
    let commands: Map<string, IBotInteraction> = new Map();
    let commandList = setupInfo.commands as string[];

    if (!commandList || (commandList).length == 0) return null;
    
    for (const commandName of commandList) {
        const CommandClass = require(`${commandsPath}/${commandName}`).default;
        const command = new CommandClass() as IBotInteraction;
        commands.set(commandName, command);
    }
    return commands;
}

async function sendCommands(commands: Map<string, IBotInteraction>): Promise<ApplicationCommand<{}>[]> {
    try {
        let applicationCommands : ApplicationCommand[] = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID!),
            { 
                body: Array.from(commands.values()).map((command) => command.data().json())
            },
        ) as ApplicationCommand[];
        return applicationCommands;
    } catch (error) {
        console.error(error);
        return [];
    }
}

function setCommandPermissions(applicationCommands: ApplicationCommand[], commandMap: Map<string, IBotInteraction>) {
    for (let command of applicationCommands) {
        let commandObject = commandMap.get(command.name);

        if (commandObject!.perms() == 'both') continue;
        let acceptRole = commandObject!.perms() == 'student' ? 'student' : 'teacher';
        let denyRole = commandObject!.perms() == 'teacher' ? 'student' : 'teacher';
        const permissionData: ApplicationCommandPermissions[] = [{
                id: acceptRole,
                type: ApplicationCommandPermissionType.Role,
                permission: true,
            }, {
                id: denyRole,
                type: ApplicationCommandPermissionType.Role,
                permission: false,
            }];

        command.permissions.add({
            permissions: permissionData,
            token: process.env.TOKEN!
        });
    }
}

async function refreshCommands() {
    let commands = loadCommands(`${__dirname}/commands`);
    if (!commands) return;
    let commandObjects = await sendCommands(commands);
    setCommandPermissions(commandObjects, commands);
}

function loadEvents(commandsPath: string){
    let eventList = setupInfo.events as string[];

    if (!eventList || eventList.length == 0) return; 

    for (const eventName of eventList){ //turns events in config.ts into a string array and iterates over them
        const EventsClass = require(`${commandsPath}/${eventName}`).default;
        const event = new EventsClass() as IBotEvent;
        events.push(event);
    }
}