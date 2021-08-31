import * as Discord from "discord.js";
import { IBotCommand } from "../api/capi";


export default class ping implements IBotCommand {
    private readonly aliases = ["ping","pong"]

    name(): string {
        return "ping";
    } 

    help(): string {
        return "ping";
    }   
    
    cooldown(): number{
        return 2;
    }
    isThisCommand(command: string): boolean {
        return this.aliases.includes(command);
    }

    async runCommand(args: string[], msg: Discord.Message, Bot: Discord.Client): Promise<void> {
        console.log("hello");
        msg.reply("Pong!");
}
}