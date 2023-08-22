/**
 * Interface for command
 */
import { CommandInteraction, Client } from "discord.js";

export interface IBotInteraction {
    name(): string;
    help(): string;
    cooldown(): number;
    isThisInteraction(command: string): boolean;
    runCommand(interaction: CommandInteraction, Bot: Client): Promise<void>;
    data(): any
    perms(): 'teacher' | 'student' | 'both'
}