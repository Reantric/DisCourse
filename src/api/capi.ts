import * as Discord from "discord.js";

export interface IBotInteraction { //basically the blueprint for all interactions to follow!
    name(): string;
    help(): string;
    cooldown(): number;
    isThisInteraction(command: string): boolean; //make sure commands are all checked (i could get rid of this but its a nice safeguard along with config.ts!)
    runCommand(interaction: Discord.CommandInteraction, Bot: Discord.Client): Promise<void>; /*give the args, int and bot, and is of type Promise<void> 
    which all that really means is that it's expecting the data to be asynchronous; not orderly. Basically it'll be a lot more lenient with you ;D
    */
   data(): any // return data of slash command so json can be applied
   perms(): 'teacher' | 'student' | 'both' // add sufficient perms!
}