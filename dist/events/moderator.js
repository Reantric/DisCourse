"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
const db = require("quick.db");
var Filter = require('bad-words'), filter = new Filter();
var badwordsArray = require('badwords/array');
var forbiddenWords = ['banana', 'apple', 'strawberry', 'pineapple', 'grape', 'melon', 'peach', 'avacado', 'mango'];
class moderator {
    name() {
        return "moderator";
    }
    help() {
        return "moderator";
    }
    runEvent(msg, Bot) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let arr = db.get(`${msg.author.id}.messages`);
            let allMessages = arr.join('');
            for (var i = 0; i < badwordsArray.length; i++) {
                if (allMessages.includes(badwordsArray[i])) {
                    db.add(`${msg.author.id}.strikes`, 1);
                    msg.reply(`${msg.author.username} now has ${db.get(`${msg.author.id}.strikes`)} strikes!`);
                    db.set(`${msg.author.id}.messages`, []);
                    break;
                }
            }
            let strikeAmount = db.get(`${msg.author.id}.strikes`);
            if (strikeAmount >= 3) {
                var role = (_a = msg.guild.roles.cache.find(role => role.name == 'Mute')) === null || _a === void 0 ? void 0 : _a.id.toString();
                console.log(msg.guild.roles.cache.find(role => role.name == 'Mute'));
                if (msg.member.roles.cache.some((role) => role.name === 'Student')) {
                    (_b = msg.guild) === null || _b === void 0 ? void 0 : _b.members.fetch(msg.author.id).then(user => {
                        user.roles.set([role]);
                    });
                }
            }
        });
    }
}
exports.default = moderator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2V2ZW50cy9tb2RlcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQSxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsK0JBQStCO0FBQy9CLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFDN0IsTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7QUFDMUIsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDOUMsSUFBSSxjQUFjLEdBQUMsQ0FBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLFlBQVksRUFBRSxXQUFXLEVBQUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzFHLE1BQXFCLFNBQVM7SUFFMUIsSUFBSTtRQUNBLE9BQU8sV0FBVyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJO1FBQ0EsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQztJQUdLLFFBQVEsQ0FBQyxHQUFvQixFQUFFLEdBQW1COzs7WUFDcEQsSUFBSSxHQUFHLEdBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQTtZQUUzQyxJQUFJLFdBQVcsR0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBR3ZDLEtBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsR0FBQyxhQUFhLENBQUMsTUFBTSxFQUFDLENBQUMsRUFBRSxFQUFDO2dCQUVyQyxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBRzFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNyQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLFlBQVksRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUE7b0JBQzFGLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFBO29CQUV2QyxNQUFNO2lCQUNSO2FBRUQ7WUFDRCxJQUFJLFlBQVksR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU8sQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3JELElBQUcsWUFBWSxJQUFFLENBQUMsRUFBQztnQkFDakIsSUFBSSxJQUFJLEdBQVEsTUFBQSxHQUFHLENBQUMsS0FBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsMENBQUUsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUN4RixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUE7Z0JBQ3JFLElBQUcsR0FBRyxDQUFDLE1BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQVEsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsRUFBQztvQkFDbkUsTUFBQSxHQUFHLENBQUMsS0FBSywwQ0FBRSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFPLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUEsRUFBRTt3QkFDcEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO29CQUMxQixDQUFDLENBQUMsQ0FBQTtpQkFDRDthQUVGOztLQUtOO0NBQ0Y7QUE5Q0gsNEJBOENHIn0=