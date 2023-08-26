import { Client, Collection, GuildMember, InteractionCollector, Message, Role, SelectMenuInteraction, TextChannel } from "discord.js";
import { IBotInteraction } from "../api/capi";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } from "discord.js";
import { CommandAccess } from "../types";
const { QuickDB } = require("quick.db");
const db = new QuickDB();
var qid = db.table('id');
const { SlashCommandBuilder } = require('@discordjs/builders');
//teacheronly
export default class mcq implements IBotInteraction {

    name(): string {
        return "mcq";
    }

    help(): string {
        return "Make a multiple-choice question for your students.";
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
    perms(): CommandAccess {
        return 'teacher';
     }

async runCommand(interaction: any, Bot: Client): Promise<void> {
    let msgToHold: Message;
    //creates answer choices
    let role = interaction.guild!.roles.cache.find((role: Role) => role.name == 'Student') as Role;
    const arr = ['right-answer','wrong-answer1','wrong-answer2','wrong-answer3','wrong-answer4'];
    let answers: any[] = [];
    let labels = ["A","B","C","D","E"]
    for (let i=0;i<arr.length;i++){
        if(interaction.options.get(arr[i]) != null){
            if(arr[i]==='right-answer'){
                let obj = {label: i, description: interaction.options.getString(arr[i]),value: "r"};
                answers.push(obj);
            }
            else{
                let obj = {label: i, description: interaction.options.getString(arr[i]),value: `w${i.toString()}`};
                answers.push(obj);
            }
        }
    }

    const shuffleArray = (array:any) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
      }
    
    shuffleArray(answers);

    for (let i=0;i<answers.length;i++){
        answers![i].label = labels[i];
    }
    var id = qid.get("id");
    id = id.toString();
    qid.set("id",qid.get("id")+1);
    //makes/sends the message
    const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId(id)
            .setPlaceholder('Pick an answer!')
            .addOptions(answers),
        );
    interaction.reply({content: "Creating your question...", ephemeral:true});
    let question = new EmbedBuilder();
    question.setTitle("Multiple-Choice Question")
    .setDescription("Students, please answer the following question your teacher has asked.")
    .setColor('Yellow');
    
    let answerchoices = 'Select one of the following answers:';
    for(let i=0;i<answers.length;i++){
        try{
            answerchoices+=`\n${answers[i].label}. ${answers[i].description}`; // change to addfield lataer
        }
        finally{
        }
    }
    let time:Date = new Date();
    time.setHours(new Date().getHours()+interaction.options.getInteger('exptime'));
    question.addFields( interaction.options.getString('question'), answerchoices)
    .addFields("Points: ", interaction.options.getInteger('points').toString())
    .setFooter({text: `This question must be completed by ${time.getHours().toString().padStart(2,"0")}:${time.getMinutes().toString().padStart(2,"0")}`})
    .setTimestamp();

    msgToHold = await interaction.channel.send({ embeds:[question],content: `<@&${role.id}>`, components: [row] });
    //response collector
    let allRoleUsers:any[] = [];
    let responses:any={};
    await interaction.guild.members.fetch().then((fetchedMembers:any) => {
        fetchedMembers.forEach((v: GuildMember) => {
            if (v.roles.cache.some((role: { name: string; }) => role.name === 'Student')){
                allRoleUsers.push(v);
                responses[v.id]=[v,null];
            }
        });
    })
    const filter = (i: SelectMenuInteraction) => i.customId === id;
    const collector: InteractionCollector<SelectMenuInteraction> = 
        interaction.channel!.createMessageComponentCollector(
            { filter, time: interaction.options.getInteger("exptime")*60*60*1000 }
        );


    var answered: Collection<string, boolean> = new Collection();
    collector.on('collect', async (i: SelectMenuInteraction) => {
        if (i.customId == id){
            i.deferUpdate();
            if (!allRoleUsers.some(m => m.id == i.user.id)){
                i.followUp({content: "Your answer was not saved as you are not a student.", ephemeral: true});
            } else {
            if (!answered.has(i.member!.user.id)){
                answered.set(i.member!.user.id,false);
                if(i.values[0]==="r"){    
                    const points = interaction.options.getInteger("points");
                    await db.set(`${i.member!.user.id}.points`,await db.get(`${i.member!.user.id}.points`)+points);
                    i.followUp({content: 'You are correct!', ephemeral:true});
                    let member = i.member!.user.id;
                    responses[member][1]="r";
                }
                else{
                    i.followUp({content: 'Sorry, your choice wasn\'t correct!', ephemeral:true});
                    let member = i.member!.user.id;
                    responses[member][1]=i.values[0];
                }
            }
            else if (!answered.get(i.member!.user.id)){
                i.followUp({content: 'You have already responded to this question!', ephemeral:true});
                answered.set(i.member!.user.id,true);
            }
        }
    }
        
    });

    collector.on('end', () => {
        //changes message
        const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(id)
                .setLabel(`Finished`)
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true),
        );
        msgToHold.edit({ content: "You can no longer answer this question.", components: [row] });

        let answermap:any = {};
        let answerlist = "";
        for(let k = 0;k<answers.length;k++){
            answermap[answers[k].value] = [answers[k].label,answers[k].description];
            answerlist += answermap[answers[k].value][0]+". " +answermap[answers[k].value][1]+"\n";
        }
        let correcters = "";
        let wrongers = "";
        let wrongAnswers = "";
        for(let k = 1;k<answers.length;k++){
            wrongAnswers += answermap[`w${k}`][0]+", ";
        }
        wrongAnswers = wrongAnswers.substring(0,wrongAnswers.length-2);
        let noresponders = "";
        for(let j = 0; j<Object.keys(responses).length;j++){
            let nickname = `${responses[allRoleUsers[j].user.id][0].displayName} #${responses[allRoleUsers[j].user.id][0].user.discriminator}`;
            //console.log(nickname);
            if(responses[allRoleUsers[j].user.id][1] === "r"){
                correcters += `${nickname}\n`;
            }
            else{
                //console.log("cr0nge");
                if(responses[allRoleUsers[j].user.id][1] === null){
                    //console.log("in null");
                    noresponders += `${nickname}\n`;
                }
                else{
                    switch(responses[allRoleUsers[j].user.id][1]) {
                        case "w1":
                            wrongers+=`${nickname}: ${answermap["w1"][0]}\n`;
                            break;
                        case "w2":
                            wrongers+=`${nickname}: ${answermap["w2"][0]}\n`;
                            break;
                        case "w3":
                            wrongers+=`${nickname}: ${answermap["w3"][0]}\n`;
                            break;
                        case "w4":
                            wrongers+=`${nickname}: ${answermap["w4"][0]}\n`;
                            break;
                        default:
                            console.log(console.error("oh darn!"));
                            break;
                    }
                }
            }
        }
        if(noresponders === ""){
            noresponders = "Everybody responded!";
        }
        if(wrongers === ""){
            wrongers = "Nobody got it wrong!";
        }
        if(correcters === ""){
            correcters = "Nobody got it right!";
        }
        const embed = new EmbedBuilder()
            .setColor('White')
            .setTitle('Multiple-Choice Question Results')
            .setDescription('Here\'s what your students answered!')
            .addFields(
                {name:interaction.options.getString("question"),value: answerlist},
                {name:`Correct Answer: ${answermap["r"][0]}`, value: correcters},
                {name:`Wrong Answers: ${wrongAnswers}`, value: wrongers},
                {name:`Did Not Respond:`, value: noresponders},
                )
            .setTimestamp()
            .setFooter({text: `Question ID: ${id}`});

            const channel: TextChannel = interaction.guild?.channels.cache.find((channel:any) => channel.name == 'teacher') as TextChannel;
            channel.send({embeds: [embed]});
    })
}


}