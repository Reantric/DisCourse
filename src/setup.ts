var fs = require('fs');
var commandFiles = fs.readdirSync(`${__dirname}/commands`);
var eventFiles = fs.readdirSync(`${__dirname}/events`);

export let setupInfo = {
    //"prefix": "!",
    "commands": commandFiles,
    "events": eventFiles,
    "guildID":"886326356072337438"
}

