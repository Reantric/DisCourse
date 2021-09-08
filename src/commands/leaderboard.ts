import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
import * as db from "quick.db";
const { SlashCommandBuilder } = require('@discordjs/builders');

export function confidence(x: number, n: number) {
    let BOUND = 0.05;
    BOUND * Math.sqrt(n) / Math.sqrt(x)
}
//do i need that what does it even do
function cTC(a: (number)[], b: (number)[]) {
    if (isNaN(a[1]))
        return 1;
    if (isNaN(b[1]))
        return -1;

    if (a[1] === b[1]) {
        if (a[2] > b[2])
            return 1;
        else if (b[2] < a[2])
            return -1;
        return 0;
    }
    else {
        return (a[1] < b[1]) ? 1 : -1;
    }
}

export default class leaderboard implements IBotInteraction {

    private readonly aliases = ["leaderboard","lb"]

    name(): string {
        return "leaderboard";
    } 

    help(): string {
        return "leaderboard";
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
    }

    async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {
        let userArray:any=[];
        let guildArray=interaction.guild!.members.cache.map((element: any)=>{
            return element.id 
        })
        for(const o of db.all()){
            if (o.ID == "817230166824321054")
                continue;
            if(guildArray.includes(o.ID)){

            let senti = o.data.points;
            if (senti == undefined || senti == null)
                senti = NaN;
            userArray.push([o.ID, senti])
            }
        }
        userArray.sort(cTC)
    //    console.log(userArray)
        const embed = new Discord.MessageEmbed()
        .setTitle('Positivity Leaderboard!')
        
        .setColor('#0099ff')
        .setAuthor(Bot.user!.username, Bot.user!.avatarURL()!)
        //.setImage('https://i.redd.it/l28662sbcec51.png')
        .setThumbnail('https://i.imgur.com/aowYZQG.jpeg')
        //.setAuthor(msg.author.username)
        var count;
        if(interaction.guild!.memberCount<11){
           count = interaction.guild!.memberCount-1;
        }
        else{
            count=10;
        }
        let bruh = "ten";
        switch (count){
            case 1:
                bruh = ""
                break;
            case 2:
                bruh = "two"
                break;
                case 3:
                    bruh = "three"
                    break;
                    case 4:
                        bruh = "four"
                        break;
                        
                        case 5:
                            bruh = "five"
                            break;
                            case 6:
                bruh = "six"
                break;
                case 7:
                bruh = "seven"
                break;
                case 8:
                bruh = "eight"
                break;
                case 9:
                bruh = "nine"
                break;
        }
        embed.setDescription(`Here are the top ${bruh} most positive people in the server!`)
        let average: any = 0, activeCount = 0;
        for (const c of userArray){
            if (!isNaN(c[1])){
                average += c[1]
                activeCount++;
            }
        }
        average /= activeCount;
        if (isNaN(average))
            average = "N/A";
        else
            average = average.toFixed(2);

        embed.addField(`Average Server Score: `,`${(average)}`);
        
        for(var i=0;i<count;i++){
            let username = Bot.users.cache.find(user => user.id === userArray[i][0])?.username;//cannot read property 0 of indefined
            let rounded;
                if(isNaN(userArray[i][1])){
                    rounded = NaN;
                    userArray[i][1] = "N/A";
        }
                 else {
                    rounded =  Math.round(userArray[i][1]*2)/2;
                    userArray[i][1] = userArray[i][1].toFixed(2);
    }
            
                let initializer = "";

                if(i==0)
                        initializer = `<:first_place:822885876144275499>`;
                else if(i==1)
                        initializer = `<:second_place:822887005679648778>`;                
                else if(i==2)
                        initializer = `<:third_place:822887031143137321>`;

                let confidence = "";
                if (!isNaN(rounded)){
                    const n = userArray[i][2];
                    confidence = `± ${(1-n/(n+1)).toFixed(2)}`
                }

                if (userArray[i][0] == interaction.member.user.id)
                    embed.addFields(
                        { name:`${initializer} **#${(i+1)}: ${username}**`, value: `**${userArray[i][1]} ${confidence} ()**`},)
                 else
                    embed.addFields(
                        { name:`${initializer} #${(i+1)}: ${username}`, value: `${userArray[i][1]} ${confidence} ()`},)
                
                
        }
        
        embed.setTimestamp()
        let ind = this.search(userArray,interaction.author.id);
        let rounded = db.get(`${interaction.author.id}.recycleAmt`) == 0 ? NaN : Math.round(userArray[ind][1]*2)/2;
        let initializer = "";

                if(ind==0)
                        initializer = `<:first_place:822885876144275499>`;
                else if(ind==1)
                        initializer = `<:second_place:822887005679648778>`;                
                else if(ind==2)
                        initializer = `<:third_place:822887031143137321>`;
        
                        
        if (db.get(`${interaction.author.id}.recycleAmt`) == 0)                
            embed.addField(`${initializer} **#${ind+1}: ${interaction.author.username}**`,`**N/A ()**`)
        else{
            const n = userArray[ind][2];
            let confidence = `± ${(1-n/(n+1)).toFixed(2)}`
                
            embed.addField(`${initializer} **#${ind+1}: ${interaction.author.username}**`,`**${Number(userArray[ind][1]).toFixed(2)} ${confidence} ()**`)
        }

        //interaction.channel.send(embed)
                
    interaction.reply({embeds: [embed], ephemeral:false})
}

search(array: any[][], targetValue: any) {
    for (var i = 0; i < array.length; i++){
        if (array[i][0] == targetValue)
            return i;
    }
    return -1;
}

    
}