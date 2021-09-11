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
const db = require("quick.db");
var forbiddenWords = ['mango', 'grape', 'apple', 'orange', 'tangerine', 'lemon', 'banana', 'peach', 'plum', 'pineapple', 'papaya'];
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
            for (let i = 0; i < forbiddenWords.length; i++) {
                if (allMessages.includes(forbiddenWords[i])) {
                    if (msg.member.roles.cache.some((role) => role.name === 'Student')) {
                        db.add(`${msg.author.id}.strikes`, 1);
                        db.set(`${msg.author.id}.points`, Math.max(0, db.get(`${msg.author.id}.points`) - 2));
                        msg.author.send(`Watch your mouth! You now have ${db.get(`${msg.author.id}.strikes`)} strike(s)! Reach 3 and you will be muted.`);
                        db.set(`${msg.author.id}.messages`, []);
                    }
                    else {
                        msg.author.send(`You used a banned word, but you're off the hook because you're a teacher.`);
                        db.set(`${msg.author.id}.messages`, []);
                    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2V2ZW50cy9tb2RlcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQSwrQkFBK0I7QUFHL0IsSUFBSSxjQUFjLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsV0FBVyxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxXQUFXLEVBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUgsTUFBcUIsU0FBUztJQUUxQixJQUFJO1FBQ0EsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0lBR0ssUUFBUSxDQUFDLEdBQW9CLEVBQUUsR0FBbUI7OztZQUNwRCxJQUFJLEdBQUcsR0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFBO1lBQzNDLElBQUksV0FBVyxHQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFdkMsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQUM7Z0JBQ3ZDLElBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztvQkFDekMsSUFBRyxHQUFHLENBQUMsTUFBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBUSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxFQUFDO3dCQUNqRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUMsQ0FBQzt3QkFDckMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFTLEVBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFTLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUVwRixHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFVLENBQUMsNENBQTRDLENBQUMsQ0FBQTt3QkFDakksRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUE7cUJBQ3hDO3lCQUNHO3dCQUNGLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLDJFQUEyRSxDQUFDLENBQUE7d0JBQzVGLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFBO3FCQUN4QztpQkFDSjthQUNGO1lBQ0QsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFPLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNyRCxJQUFHLFlBQVksSUFBRSxDQUFDLEVBQUM7Z0JBQ2pCLElBQUk7b0JBQ0osSUFBSSxJQUFJLEdBQVEsR0FBRyxDQUFDLEtBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksTUFBTSxDQUFDLENBQUM7b0JBQ3pFLElBQUcsR0FBRyxDQUFDLE1BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQVEsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsRUFBQzt3QkFDbkUsTUFBQSxHQUFHLENBQUMsS0FBSywwQ0FBRSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFPLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUEsRUFBRTs0QkFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxTQUFTLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsQ0FBQztnQ0FDakYsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO3dCQUMvQixDQUFDLENBQUMsQ0FBQTtxQkFDRDtpQkFDRjtnQkFBQyxPQUFPLEtBQUssRUFBQztvQkFDYixPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNyQixFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQTtpQkFDeEM7YUFFQTs7S0FLTjtDQUNGO0FBbkRILDRCQW1ERyJ9