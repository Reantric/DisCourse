import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
const { SlashCommandBuilder } = require('@discordjs/builders');

export default class attendance implements IBotInteraction {

    name(): string {
        return "attendance";
    } 

    help(): string {
        return "attendance";
    }   
    
    cooldown(): number{
        return 6;
    }

    isThisInteraction(command: string): boolean {
        return command === this.name();
    }

    data(): any {
        return new SlashCommandBuilder()
		.setName(this.name())
		.setDescription(this.help())
		.addStringOption((option:any) =>
		option.setName('input')
			.setDescription('The input to echo back')
			.setRequired(true));
    }

    async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {
        
        const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setCustomId('primary')
					.setLabel(`I'm here!`)
					.setStyle('PRIMARY'),
			);
        
        await interaction.reply({ content: `<@&884297279866019880>`, components: [row] });
        await setInterval(() => {
            const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setCustomId('primary')
					.setLabel(`Expired`)
					.setStyle('DANGER')
                    .setDisabled(true),
			);
            interaction.editReply({ content: `<@&884297279866019880>`, components: [row] });

        },10000);

        const filter = (i: Discord.ButtonInteraction) => i.customId === 'primary';

        const collector: Discord.InteractionCollector<Discord.ButtonInteraction> = interaction.channel!.createMessageComponentCollector({ filter, time: 10000 });

        collector.on('collect', async (i: Discord.ButtonInteraction) => {
            i.deferUpdate();
         //   if (i.customId === 'primary') {
           //     i..reply({content: `Marked you here!`});
          //  }
        });

        collector.on('end', async (collected: any) => {
            console.log(`Collected ${collected.size} items`);     
        }
        );
	
    }
}