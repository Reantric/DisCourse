import * as Discord from "discord.js";
import { IBotEvent } from "../api/eapi";
const { QuickDB } = require("quick.db");
const db = new QuickDB();
//var Filter = require('bad-words'); //npm install badwords
//let filter = new Filter();
var forbiddenWords = ['mango', 'grape','apple','orange','tangerine','lemon','banana','peach','plum','pineapple','papaya'];
export default class moderator implements IBotEvent {

    name(): string {
        return "moderator";
    }

    help(): string {
        return "moderator";
    }   
    
    
    async runEvent(msg: Discord.Message, Bot: Discord.Client): Promise<void> {
        let arr=db.get(`${msg.author.id}.messages`)
        let allMessages: string = arr.join('');
        
        for(let i=0; i<forbiddenWords.length;i++){
          if(allMessages.includes(forbiddenWords[i])){
            if(msg.member!.roles.cache.some((role:any) => role.name === 'Student')){
                  db.add(`${msg.author.id}.strikes`,1);
                  db.set(`${msg.author.id}.points`,Math.max(0,db.get(`${msg.author.id}.points`)-2));
                  
                msg.author.send(`Watch your mouth! You now have ${db.get(`${msg.author.id}.strikes`)} strike(s)! Reach 3 and you will be muted.`)
                db.set(`${msg.author.id}.messages`, [])
              }
              else{
                msg.author.send(`You used a banned word, but you're off the hook because you're a teacher.`)
                db.set(`${msg.author.id}.messages`, [])
              }
          }
        }
        let strikeAmount = db.get(`${msg.author!.id}.strikes`);
          if(strikeAmount>=3){
            try {
            var role: any = msg.guild!.roles.cache.find(role => role.name == 'Mute');
            if(msg.member!.roles.cache.some((role:any) => role.name === 'Student')){
                msg.guild?.members.fetch(msg.author!.id).then(user=>{
                  if (!user.roles.cache.find(role => (role.name == 'Teacher' || role.name == 'Admin')))
                     user.roles.set([role])
            })
            }
          } catch (error){
            console.error(error);
            db.set(`${msg.author.id}.messages`, [])
          }
            
          }
                
    
                

    }
  }