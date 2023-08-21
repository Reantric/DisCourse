/**
 * Interface for command
 */
import * as Discord from "discord.js";

export interface IBotInteraction {
    name(): string;
    help(): string;
    cooldown(): number;
    isThisInteraction(command: string): boolean;
    runCommand(interaction: Discord.CommandInteraction, Bot: Discord.Client): Promise<void>;
    data(): any
    perms(): 'teacher' | 'student' | 'both'
}