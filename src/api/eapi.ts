/**
 * Interface for event
 */
import * as Discord from "discord.js";

export interface IBotEvent {
    name(): string;
    help(): string;
    runEvent(msg: Discord.Message, Bot: Discord.Client): Promise<void>;
}