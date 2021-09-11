"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var fs = require('fs');
var cfiles = fs.readdirSync(`${__dirname}/commands`);
var efiles = fs.readdirSync(`${__dirname}/events`);
exports.config = {
    "token": "ODg1NTQyNDY4NjkzNjc2MDU0.YTojsQ.ZwiBd2kAnPDk8Njz1TWSZVlplrg",
    "prefix": "!",
    "commands": cfiles,
    "events": efiles,
    "clientID": "885542468693676054",
    "guildID": "886326356072337438"
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLFNBQVMsV0FBVyxDQUFDLENBQUM7QUFDckQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLFNBQVMsU0FBUyxDQUFDLENBQUM7QUFFeEMsUUFBQSxNQUFNLEdBQUc7SUFDaEIsT0FBTyxFQUFFLDZEQUE2RDtJQUN0RSxRQUFRLEVBQUUsR0FBRztJQUNiLFVBQVUsRUFBRSxNQUFNO0lBQ2xCLFFBQVEsRUFBRSxNQUFNO0lBQ2hCLFVBQVUsRUFBQyxvQkFBb0I7SUFDL0IsU0FBUyxFQUFDLG9CQUFvQjtDQUNqQyxDQUFBIn0=