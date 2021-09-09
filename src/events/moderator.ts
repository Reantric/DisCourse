import * as Discord from "discord.js";
import { IBotEvent } from "../api/eapi";
var fs = require('fs');
import * as db from "quick.db";
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
        console.log(db.all())
        let allMessages: string = arr.join('');
        
        
        for(var i=0;i<forbiddenWords.length;i++){
          if (allMessages.includes(forbiddenWords[i])) {
            //const mentionedUser = msg.mentions.users.first();
            db.add(`${msg.author.id}.strikes`,1);
            msg.reply(`${msg.author.username} now has ${db.get(`${msg.author.id}.strikes`)} strikes!`)
            db.set(`${msg.author.id}.messages`, arr.slice(0,arr.length-forbiddenWords[i].length))
            //console.log(db.get(`${msg.author.id}.msgArray`))
            //msg.delete();
            //console.log(allMessages)
            //console.log('Deleted message due to forbidden word');
      //      msg.author.send("Hey, you used a bad word in your recent message. It was deleted and you were given a strike. "
      //      +"You now have "+`${db.get(`${msg.author.id}.strikes`)} strikes!`);
            // delete message, log, etc.
            
            break;
          }
          
        }
        // let strikeAmount = db.get(`${msg.author!.id}.strikes`);
        //   if(strikeAmount>5){
        //     var role: any = msg.guild!.roles.cache.find(role => role.name == 'mute');
        //     console.log(typeof role)
        //     msg.guild?.members.fetch(msg.author!.id).then(user=>{
        //         user.roles.add(role)
        //     })
        //   }
                
    
                

    }
  }