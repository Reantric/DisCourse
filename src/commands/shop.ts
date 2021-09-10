import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
import * as db from "quick.db";
const { SlashCommandBuilder } = require('@discordjs/builders');

export default class shop implements IBotInteraction {

    private readonly aliases = ["shop"]

    name(): string {
        return "shop";
    } 

    help(): string {
        return "shop";
    }   
    
    cooldown(): number{
        return 20;
    }
    isThisInteraction(command: string): boolean {
        return this.aliases.includes(command);
    }
    data(): any {
        return new SlashCommandBuilder()
        .setName(this.name())
        .setDescription(this.help())
    }
    perms(): "teacher" | "student" | "both" {
        return 'both';
     }

    async runCommand(interaction: Discord.CommandInteraction, Bot: Discord.Client): Promise<void> {
        
        //ephemeral
        const shopEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Shop')
            .setDescription('A marketplace to buy things!')
            .setThumbnail('https://cdn.discordapp.com/attachments/775700759869259779/885703618097983539/AKedOLQgG2F4XjLYwul4pevvcE9rrDtYeu-E7vHVl8Xf9gs900-c-k-c0x00ffffff-no-rj.png')
            .setTimestamp()
            .setFooter('Shop', 'https://i.pinimg.com/originals/80/fd/eb/80fdeb47d44130603f5a2e440c421a66.jpg');


            interaction.reply({ephemeral: true, embeds: [shopEmbed]});

    }
}