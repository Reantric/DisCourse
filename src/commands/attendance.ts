import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
const { SlashCommandBuilder } = require('@discordjs/builders');

const marked: Discord.Collection<string,boolean> = new Discord.Collection();

export default class attendance implements IBotInteraction {

    name(): string {
        return "attendance";
    } 

    help(): string {
        return "Attendance made easy!";
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
		option.setName('time')
			.setDescription('Enter a time! (in 24 hour format!)')
			.setRequired(true))
        .addIntegerOption((option:any) =>
            option.setName('exptime')
                .setDescription('The amount of time attendance is valid for!'));
    }

    async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {
        var exptime = interaction.options.getInteger('exptime');
        if (exptime == undefined)
            exptime = 10;
        const time = interaction.options.getString('time').split(':');
        let ti: any = new Date();
        let now = new Date();
        ti.setHours(parseInt(time[1]));
        ti.setMinutes(parseInt(time[0]));
        ti = ti.getMilliseconds();
        if (!(now.getHours() < parseInt(time[0]) || (now.getHours() == parseInt(time[0]) && now.getMinutes() < parseInt(time[1])))){
            ti = 24*60*60*1000 - ti;
        } 
        console.log(ti,now.getMilliseconds());

        setTimeout(() => {
            setInterval(async () => {
                const row = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId('attend')
                            .setLabel(`I'm here!`)
                            .setStyle('PRIMARY'),
                    );
                
                await interaction.reply({ content: `<@&884297279866019880>`, components: [row] });
                setTimeout(() => {
                    const row = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId('attend')
                            .setLabel(`Expired`)
                            .setStyle('DANGER')
                            .setDisabled(true),
                    );
                    interaction.editReply({ content: `<@&884297279866019880>`, components: [row] });
    
                },exptime*1000);
    
                const filter = (i: Discord.ButtonInteraction) => i.customId === 'attend';
    
                const collector: Discord.InteractionCollector<Discord.ButtonInteraction> = interaction.channel!.createMessageComponentCollector({ filter, time: exptime*1000 });
    
                collector.on('collect', async (i: Discord.ButtonInteraction) => {
                    console.log(marked);
                    if (i.customId == 'attend'){
                        i.deferUpdate();
                        if (!marked.has(i.member!.user.id)){
                            i.followUp({content: `Marked you here!`, ephemeral:true});
                            marked.set(i.member!.user.id,false);
                        }
                        else if (!marked.get(i.member!.user.id)){
                            i.followUp({content: `You have already been marked!`, ephemeral:true});
                            marked.set(i.member!.user.id,true);
                        }
                }
                    
                });
    
                collector.on('end', async (collected: any) => {
                    console.log(`Collected ${collected.size} items`);     
                }
                );
                },24*60*60*1000);
        },ti)
        
    }
}