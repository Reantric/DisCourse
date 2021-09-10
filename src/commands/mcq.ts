import * as Discord from "discord.js";
import { IBotInteraction } from "../api/capi";
import * as db from "quick.db";
var qid = new db.table('id');
const { SlashCommandBuilder } = require('@discordjs/builders');
let msgToHold: Discord.Message;
//teacheronly
export default class mcq implements IBotInteraction {

    name(): string {
        return "mcq";
    }

    help(): string {
        return "Make a multiple-choice question for your students";
    }   
    
    cooldown(): number{
        return 2;
    }
    isThisInteraction(command: string): boolean {
        return command === "mcq";
    }
    data(): any {
        return new SlashCommandBuilder()
        .setName(this.name())
        .setDescription(this.help())
        .addStringOption((option:any) => option.setName('question').setDescription('Enter your question (just the question):').setRequired(true))
        .addIntegerOption((option:any) => option.setName('points').setDescription('Point value:').setRequired(true))
        .addIntegerOption((option:any) => option.setName('exptime').setDescription('Hours till expiration:').setRequired(true))
        .addStringOption((option:any) => option.setName('right-answer').setDescription('Correct answer choice:').setRequired(true))
        .addStringOption((option:any) => option.setName('wrong-answer1').setDescription('Wrong answer choice 1:').setRequired(true))
        .addStringOption((option:any) => option.setName('wrong-answer2').setDescription('Wrong answer choice 2:').setRequired(false))
        .addStringOption((option:any) => option.setName('wrong-answer3').setDescription('Wrong answer choice 3:').setRequired(false))
        .addStringOption((option:any) => option.setName('wrong-answer4').setDescription('Wrong answer choice 4:').setRequired(false))
        
        ;
    }
    perms(): "teacher" | "student" | "both" {
        return 'teacher';
     }

async runCommand(interaction: any, Bot: Discord.Client): Promise<void> {
    //creates answer choices
    let role = interaction.guild!.roles.cache.find((role: Discord.Role) => role.name == 'Student') as Discord.Role;
    const arr = ['right-answer','wrong-answer1','wrong-answer2','wrong-answer3','wrong-answer4'];
    let answers: any[] = [];
    let labels = ["A","B","C","D","E"]
    for (let i=0;i<arr.length;i++){
        if(interaction.options.get(arr[i]) != null){
            if(arr[i]==='right-answer'){
                let obj = {label: i, description: interaction.options.getString(arr[i]),value: "r"};
                let randIn = Math.floor(Math.random()*answers.length);
                answers.splice(randIn, 0, obj);
            }
            else{
                let obj = {label: i, description: interaction.options.getString(arr[i]),value: `w${i.toString()}`};
                let randIn = Math.floor(Math.random()*answers.length);
                answers.splice(randIn, 0, obj);
            }
        }
    }

    for (let i=0;i<answers.length;i++){
        answers![i].label = labels[i];
    }
    var id = qid.get("id");
    id = id.toString();
    qid.set("id",qid.get("id")+1);
    //makes/sends the message
    const row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
            .setCustomId(id)
            .setPlaceholder('Pick an answer!')
            .addOptions(answers),
        );
    interaction.reply({content: "Creating your question...", ephemeral:true});
    let question = new Discord.MessageEmbed();
    question.setTitle("Multiple-Choice Question")
    .setDescription("Students, please answer the following question your teacher has asked.")
    
    let answerchoices = 'Select one of the following answers:';
    for(let i=0;i<answers.length;i++){
        try{
            answerchoices+=`\n${answers[i].label}. ${answers[i].description}`;
        }
        finally{
        }
    }
    let time:Date = new Date();
    time.setHours(new Date().getHours()+interaction.options.getInteger('exptime'));
    question.addField( interaction.options.getString('question'), answerchoices)
    .addField("Points: ", interaction.options.getInteger('points'))
    .setFooter(`This question must be completed by ${time.getHours().toString().padStart(2,"0")}:${time.getMinutes().toString().padStart(2,"0")}`)
    .setTimestamp();

    msgToHold = await interaction.channel.send({ embeds:[question],content: `<@&${role.id}>`, components: [row] });
    console.log(id);
    //changes message after
    setTimeout(() => {
        const row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setCustomId(id)
                .setLabel(`Finished`)
                .setStyle('DANGER')
                .setDisabled(true),
        );
        msgToHold.edit({ content: "You can no longer answer this question.", components: [row] });

    },interaction.options.getInteger("exptime")*60*60*1000);


    //response collector
    let allRoleUsers:any[] = [];
    let responses:any={};
    await interaction.guild.members.fetch().then((fetchedMembers:any) => {
        fetchedMembers.forEach((v: Discord.GuildMember) => {
            if (v.roles.cache.some((role: { name: string; }) => role.name === 'Student')){
                allRoleUsers.push(v);
                responses[v.id]=null;
            }
        });
    })
    console.log(allRoleUsers.length);
    console.log(responses)
    const filter = (i: Discord.SelectMenuInteraction) => i.customId === id;
    const collector: Discord.InteractionCollector<Discord.SelectMenuInteraction> = 
        interaction.channel!.createMessageComponentCollector(
            { filter, time: interaction.options.getInteger("exptime")*60*60*1000 }
        );


    var answered: Discord.Collection<string,boolean> = new Discord.Collection();
    collector.on('collect', async (i: Discord.SelectMenuInteraction) => {
        if (i.customId == id){
            i.deferUpdate();
            if (!allRoleUsers.some(m => m.id == i.user.id)){
                i.followUp({content: "Your answer was not saved as you are not a student.", ephemeral: true});
            } else {
            if (!answered.has(i.member!.user.id)){
                answered.set(i.member!.user.id,false);
                console.log(i);
                if(i.values[0]==="r"){    
                    const points = interaction.options.getInteger("points");
                    db.set(`${i.member!.user.id}.points`,db.get(`${i.member!.user.id}.points`)+points);
                    i.followUp({content: 'You are correct!', ephemeral:true});
                    let member = i.member!.user.id;
                    responses[member]="r";
                    console.log(responses);
                }
                else{
                    i.followUp({content: 'Sorry, your choice wasn\'t correct!', ephemeral:true});
                    let member = i.member!.user.id;
                    responses[member]=i.values[0];
                    console.log(responses);
                }
            }
            else if (!answered.get(i.member!.user.id)){
                i.followUp({content: 'You have already responded to this question!', ephemeral:true});
                answered.set(i.member!.user.id,true);
            }
        }
    }
        
    });

    collector.on('end', collected => {
        console.log(`Collected ${collected.size} items`);
        console.log(collected);
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Multiple-Choice Question Summary')
            .setDescription('Here\'s what your students answered!')
            embed.setTimestamp()
            .setFooter(`Question ID: ${id}`);


            const channel: Discord.TextChannel = interaction.guild?.channels.cache.find((channel:any) => channel.name == 'teacher') as Discord.TextChannel;
            channel.send({embeds: [embed]});
    })
}


}