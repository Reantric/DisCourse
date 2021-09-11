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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2V2ZW50cy9tb2RlcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQSwrQkFBK0I7QUFHL0IsSUFBSSxjQUFjLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsV0FBVyxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxXQUFXLEVBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUgsTUFBcUIsU0FBUztJQUUxQixJQUFJO1FBQ0EsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0lBR0ssUUFBUSxDQUFDLEdBQW9CLEVBQUUsR0FBbUI7OztZQUNwRCxJQUFJLEdBQUcsR0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFBO1lBQzNDLElBQUksV0FBVyxHQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFdkMsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUMsQ0FBQyxFQUFFLEVBQUM7Z0JBQ3ZDLElBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztvQkFDekMsSUFBRyxHQUFHLENBQUMsTUFBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBUSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxFQUFDO3dCQUNqRSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUMsQ0FBQzt3QkFFdkMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0NBQWtDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBVSxDQUFDLDRDQUE0QyxDQUFDLENBQUE7d0JBQ2pJLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFBO3FCQUN4Qzt5QkFDRzt3QkFDRixHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQywyRUFBMkUsQ0FBQyxDQUFBO3dCQUM1RixFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQTtxQkFDeEM7aUJBQ0o7YUFDRjtZQUNELElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDckQsSUFBRyxZQUFZLElBQUUsQ0FBQyxFQUFDO2dCQUNqQixJQUFJO29CQUNKLElBQUksSUFBSSxHQUFRLEdBQUcsQ0FBQyxLQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDO29CQUN6RSxJQUFHLEdBQUcsQ0FBQyxNQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFRLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLEVBQUM7d0JBQ25FLE1BQUEsR0FBRyxDQUFDLEtBQUssMENBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFBLEVBQUU7NEJBQ2xELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLENBQUM7Z0NBQ2pGLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTt3QkFDL0IsQ0FBQyxDQUFDLENBQUE7cUJBQ0Q7aUJBQ0Y7Z0JBQUMsT0FBTyxLQUFLLEVBQUM7b0JBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDckIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUE7aUJBQ3hDO2FBRUE7O0tBS047Q0FDRjtBQWxESCw0QkFrREcifQ==