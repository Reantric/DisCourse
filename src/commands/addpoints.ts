import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
import * as db from "quick.db";
const { SlashCommandBuilder } = require('@discordjs/builders');


export default class addpoints implements IBotInteraction {
    private readonly aliases = ["addpoints"]

    name(): string {
        return "addpoints";
    }

    help(): string {
        return "addpoints";
    }   
    
    cooldown(): number{
        return 2;
    }
    isThisInteraction(command: string): boolean {
        return this.aliases.includes(command);
    }
    data(): any {
    return new SlashCommandBuilder()
    .setName(this.name())
    .setDescription(this.help())
    .addIntegerOption((option:any) => 
        option.setName('points')
            .setDescription('How many points is this question worth?'));
}

async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {
    const int1 = interaction.options.getInteger('points')
    console.log(int1)
    db.add(`${interaction.member.user.id}.questions`,int1)
    console.log(db.get(`${interaction.member.user.id}.questions`));
    interaction.reply({content: `You added ${int1} point(s)`, ephemeral:true});
}
}