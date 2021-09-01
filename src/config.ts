var fs = require('fs');
var cfiles = fs.readdirSync(`${__dirname}/commands`);
var efiles = fs.readdirSync(`${__dirname}/events`);

export let config = {
    "token": "ODE3MjMwMTY2ODI0MzIxMDU0.YEGe5w.e7FwXjVpLq61EL-ak4l-AZ0oP4c",
    "prefix": "!",
    "commands": cfiles,
    "events": efiles,
    "clientID":"817230166824321054",
    "guildID":"775700759869259776"
}

