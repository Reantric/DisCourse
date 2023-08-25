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
const { QuickDB } = require("quick.db");
const db = new QuickDB();
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
            let arr = yield db.get(`${msg.author.id}.messages`);
            let allMessages = arr.join('');
            for (let i = 0; i < forbiddenWords.length; i++) {
                if (allMessages.includes(forbiddenWords[i])) {
                    if (msg.member.roles.cache.some((role) => role.name === 'Student')) {
                        yield db.add(`${msg.author.id}.strikes`, 1);
                        yield db.set(`${msg.author.id}.points`, Math.max(0, (yield db.get(`${msg.author.id}.points`)) - 2));
                        msg.author.send(`Watch your mouth! You now have ${yield db.get(`${msg.author.id}.strikes`)} strike(s)! Reach 3 and you will be muted.`);
                        yield db.set(`${msg.author.id}.messages`, []);
                    }
                    else {
                        msg.author.send(`You used a banned word, but you're off the hook because you're a teacher.`);
                        yield db.set(`${msg.author.id}.messages`, []);
                    }
                }
            }
            let strikeAmount = yield db.get(`${msg.author.id}.strikes`);
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
                    yield db.set(`${msg.author.id}.messages`, []);
                }
            }
        });
    }
}
exports.default = moderator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2V2ZW50cy9tb2RlcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQSxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3hDLE1BQU0sRUFBRSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFHekIsSUFBSSxjQUFjLEdBQUcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsV0FBVyxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxXQUFXLEVBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUgsTUFBcUIsU0FBUztJQUUxQixJQUFJO1FBQ0EsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUk7UUFDQSxPQUFPLFdBQVcsQ0FBQztJQUN2QixDQUFDO0lBR0ssUUFBUSxDQUFDLEdBQW9CLEVBQUUsR0FBbUI7OztZQUNwRCxJQUFJLEdBQUcsR0FBRyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDcEQsSUFBSSxXQUFXLEdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUV2QyxLQUFJLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsY0FBYyxDQUFDLE1BQU0sRUFBQyxDQUFDLEVBQUUsRUFBQztnQkFDdkMsSUFBRyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDO29CQUN6QyxJQUFHLEdBQUcsQ0FBQyxNQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFRLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssU0FB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