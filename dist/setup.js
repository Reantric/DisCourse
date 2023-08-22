"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupInfo = void 0;
var fs = require('fs');
var commandFiles = fs.readdirSync(`${__dirname}/commands`);
var eventFiles = fs.readdirSync(`${__dirname}/events`);
exports.setupInfo = {
    "commands": commandFiles,
    "events": eventFiles,
    "guildID": "775700759869259776"
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc2V0dXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxTQUFTLFdBQVcsQ0FBQyxDQUFDO0FBQzNELElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxTQUFTLFNBQVMsQ0FBQyxDQUFDO0FBRTVDLFFBQUEsU0FBUyxHQUFHO0lBRW5CLFVBQVUsRUFBRSxZQUFZO0lBQ3hCLFFBQVEsRUFBRSxVQUFVO0lBQ3BCLFNBQVMsRUFBQyxvQkFBb0I7Q0FDakMsQ0FBQSJ9