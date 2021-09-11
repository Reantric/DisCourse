var fs = require('fs');
var cfiles = fs.readdirSync(`${__dirname}/commands`);
var efiles = fs.readdirSync(`${__dirname}/events`);

export let config = {
    "token": "ODg1NTQyNDY4NjkzNjc2MDU0.YTojsQ.ZwiBd2kAnPDk8Njz1TWSZVlplrg",
    "prefix": "!",
    "commands": cfiles,
    "events": efiles,
    "clientID":"885542468693676054",
    "guildID":"886326356072337438"
}

