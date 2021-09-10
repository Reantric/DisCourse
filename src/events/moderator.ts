import * as Discord from "discord.js";
import { IBotEvent } from "../api/eapi";
var fs = require('fs');
import * as db from "quick.db";
var badwordsArray = require('badwords/array'); //npm install badwords
var forbiddenWords=['banana','apple','strawberry', 'pineapple','grape','melon','peach','avacado','mango'];//use fruit names for demonstration purposes
export default class moderator implements IBotEvent {

    name(): string {
        return "moderator";
    }

    help(): string {
        return "moderator";
    }   
    
    
    async runEvent(msg: Discord.Message, Bot: Discord.Client): Promise<void> {
        let arr=db.get(`${msg.author.id}.messages`)
        //console.log(badwordsArray)
        let allMessages: string = arr.join('');
        
        //allMessages.includes(forbiddenWords[i])
        for(var i=0;i<badwordsArray.length;i++){
            //console.log('im in the for loop')
          if (allMessages.includes(badwordsArray[i])) {
              //console.log('im in the if statement')
            //const mentionedUser = msg.mentions.users.first();
            db.add(`${msg.author.id}.strikes`,1);
            msg.reply(`${msg.author.username} now has ${db.get(`${msg.author.id}.strikes`)} strikes!`)
            db.set(`${msg.author.id}.messages`, [])
            
            break;
         }
          
        }
        let strikeAmount = db.get(`${msg.author!.id}.strikes`);
          if(strikeAmount>=3){
            var role: any = msg.guild!.roles.cache.find(role => role.name == 'Mute');
            //console.log(msg.guild!.roles.cache.find(role => role.name == 'Mute'))
            if(msg.member!.roles.cache.some((role:any) => role.name === 'Student')){
                msg.guild?.members.fetch(msg.author!.id).then(user=>{
                user.roles.set([role]) // This removes all roles, so if a user has a role higher than the bot, API Error
            })
            }
            
          }
                
    
                

    }
  }