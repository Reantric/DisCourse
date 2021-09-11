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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let arr = db.get(`${msg.author.id}.messages`);
            let allMessages = arr.join('');
            for (var i = 0; i < forbiddenWords.length; i++) {
                if (allMessages.includes(forbiddenWords[i])) {
                    if (msg.member.roles.cache.some((role) => role.name === 'Student')) {
                        db.add(`${msg.author.id}.strikes`, 1);
                        msg.reply({ content: `${msg.author.username} now has ${db.get(`${msg.author.id}.strikes`)} strikes!` });
                        db.set(`${msg.author.id}.messages`, []);
                    }
                    else {
                        msg.reply(`You used a banned word, but you're off the hook because you're a teacher.`);
                        db.set(`${msg.author.id}.messages`, []);
                    }
                    break;
                }
            }
            let strikeAmount = db.get(`${msg.author.id}.strikes`);
            if (strikeAmount >= 3) {
                try {
                    var role = msg.guild.roles.cache.find(role => role.name == 'Mute');
                    if (msg.member.roles.cache.some((role) => role.name === 'Student')) {
                        (_a = msg.guild) === null || _a === void 0 ? void 0 : _a.members.fetch(msg.author.id).then(user => {
                            if (!user.roles.cache.find(role => (role.name == 'Teacher' || role.name == 'Admin')))
                                user.roles.set([role]);
                        });
                    }
                }
                catch (error) {
                    console.error(error);
                    db.set(`${msg.author.id}.messages`, []);
                }
            }
        });
    }
}
exports.default = moderator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2V2ZW50cy9tb2RlcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQSxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsK0JBQStCO0FBQy9CLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzlDLElBQUksY0FBYyxHQUFDLENBQUMsUUFBUSxFQUFDLE9BQU8sRUFBQyxZQUFZLEVBQUUsV0FBVyxFQUFDLE9BQU8sRUFBQyxPQUFPLEVBQUMsT0FBTyxFQUFDLFNBQVMsRUFBQyxPQUFPLENBQUMsQ0FBQztBQUMxRyxNQUFxQixTQUFTO0lBRTFCLElBQUk7UUFDQSxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSTtRQUNBLE9BQU8sV0FBVyxDQUFDO0lBQ3ZCLENBQUM7SUFHSyxRQUFRLENBQUMsR0FBb0IsRUFBRSxHQUFtQjs7O1lBQ3BELElBQUksR0FBRyxHQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUE7WUFFM0MsSUFBSSxXQUFXLEdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUd2QyxLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLEdBQUMsY0FBYyxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUUsRUFBQztnQkFFdEMsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUkzQyxJQUFHLEdBQUcsQ0FBQyxNQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFRLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLEVBQUM7d0JBQ2pFLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN2QyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLFlBQVksRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFVLENBQUMsV0FBVyxFQUFDLENBQUMsQ0FBQTt3QkFDcEcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUE7cUJBQ3hDO3lCQUNHO3dCQUNGLEdBQUcsQ0FBQyxLQUFLLENBQUMsMkVBQTJFLENBQUMsQ0FBQTt3QkFDdEYsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUE7cUJBQ3hDO29CQUtILE1BQU07aUJBQ1I7YUFFRDtZQUNELElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDckQsSUFBRyxZQUFZLElBQUUsQ0FBQyxFQUFDO2dCQUNqQixJQUFJO29CQUNKLElBQUksSUFBSSxHQUFRLEdBQUcsQ0FBQyxLQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDO29CQUV6RSxJQUFHLEdBQUcsQ0FBQyxNQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFRLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLEVBQUM7d0JBQ25FLE1BQUEsR0FBRyxDQUFDLEtBQUssMENBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFBLEVBQUU7NEJBQ2xELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLENBQUM7Z0NBQ2pGLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTt3QkFDL0IsQ0FBQyxDQUFDLENBQUE7cUJBQ0Q7aUJBQ0Y7Z0JBQUMsT0FBTyxLQUFLLEVBQUM7b0JBRWIsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDckIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUE7aUJBQ3hDO2FBRUE7O0tBS047Q0FDRjtBQS9ESCw0QkErREcifQ==