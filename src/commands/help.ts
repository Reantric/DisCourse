import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
import * as db from "quick.db";
const { SlashCommandBuilder } = require('@discordjs/builders');


export default class getbanlist implements IBotInteraction {

    private readonly aliases = ["help"]

    name(): string {
        return "help";
    } 

    help(): string {
        return "help";
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
		.addUserOption((option: { setName: (arg0: string) => { (): any; new(): any; setDescription: { (arg0: string): any; new(): any; }; }; }) => option.setName(this.name()).setDescription(this.help()))
        .addStringOption((option:any) =>
            option.setName('category')
                .setDescription('The gif category'));
                // //.setRequired(true)
                // .addChoice('Funny', 'gif_funny')
                // .addChoice('Meme', 'gif_meme')
                // .addChoice('Movie', 'gif_movie'))
        
    }

    async runCommand( interaction: any, Bot: Discord.Client): Promise<void> {
        const string = interaction.options.getString('category');
        console.log(string)
        const embed = new Discord.MessageEmbed()
        .setTitle('Eclipse Help is Here!')
        .setDescription('Here are a list of our commands!')
        .setColor('#0ae090')
        .setAuthor(Bot.user!.username, Bot.user!.avatarURL()!)
        //.setAuthor(msg.author.username)
        //.addField(mod,'Mod only commands')
        .addFields(
            { name: '!banlist (MOD ONLY)', value: 'Replies with the list of banned users from the server' },
        )
        //.addField('Member available commands',' ')
        .addFields(
            { name:'!leaderboard, !lb', value:'Gives leaderboard of the top ten most positive members based on sentiment scores'},
        )
        .setThumbnail('https://wallpapercave.com/wp/wp4055520.png')
        .setTimestamp()
    
    interaction.reply({embeds: [embed], ephemeral: true});   
    /*let arr = db.all();
    for(let i = 0; i<arr.length; i++){
        
    }*/
    
}
}
