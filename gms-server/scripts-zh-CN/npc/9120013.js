/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
		       Matthias Butz <matze@odinms.de>
		       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation version 3 as published by
    the Free Software Foundation. You may not use, modify or distribute
    this program under any other version of the GNU Affero General Public
    License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
//Boss Kitty

var status;
var questions;
var answers;
var correctAnswer;
var questionNum;

function start() {
    status = -1;
    questions = ["下面物品不是狸猫所掉出的物品?","古代神社中，写有『香菇』的地方有几处？","古代神社的贩卖物品里，何者是提升攻击力的？?","下列物品中，那个物品是存在的东西？?","那个物品不存在??","在昭和镇蔬菜店老板叫什么名字?","这些物品的那个存在?","昭和村卖鱼的铺子外面写着哪几个字?","哪种道具的说明有错误？?","何者不是古代神社的元泰卖的拉面？?","昭和电影院门前的NPC 是谁？"];
    answers = [["狸猫柴火","独角狮的硬角","红色的砖"], ["6","5","4"], ["章鱼烧","福建面","面粉"], ["流氓A的徽章", "流氓B的胸衣", "流氓C的项链"], ["冻冻鱼","寒冰破魔枪","苍蝇拍"], ["萨米","卡米","由美"], ["云狐的牙齿","花束","狐狸的尾巴"], ["商荣繁盛","全场一折","欢迎光临"], ["木精灵枪-战士专用武器","橡皮榔头-单手剑","龙背刃-双手剑"], ["蛋炒面","日本炒面","蘑菇特制拉面"], ["武大郎","樱桃小丸子","绘里香"]];
    correctAnswer = [1, 1, 0, 1, 2, 2, 2, 0, 0, 2, 2];
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0 && mode == 1) {
            if (cm.isQuestStarted(8012) && !cm.haveItem(4031064)) { //quest in progress
                cm.sendYesNo("你都找到了吗？你打算尝试回答我所有的问题吗？");
            } else { //quest not started or already completed
                cm.sendOk("喵喵喵！");//lol what's this?
                cm.dispose();
            }
        } else if (status == 1 && mode == 1) {
            var hasChicken = true;
            if (!cm.haveItem(2020001, 300)) {
                hasChicken = false;
            }
            if (!hasChicken) {
                cm.sendOk("什么？不行！300！三百。不少。如果你想要更多，就给我，但我至少需要300。我们不是所有人都像你一样又大又饱满…");
                cm.dispose();
            } else {
                cm.gainItem(2020001, -300)
                cm.sendNext("干得好！现在等一下……嘿，看这里！我这里有些食物！自己拿吧。好了，现在是时候问你们一些问题了。我相信你们已经意识到了，但记住，如果你们答错了，一切都结束了。要么全赢，要么全输！");
            }
        } else if (status == 7 && mode == 1) { //2-6 are the questions
            if (selection != correctAnswer.pop()) {
                cm.sendNext("嗯...不管怎么样人总会出错! 如果想再试试,再给我300个炸鸡.")
                cm.dispose();
            } else {
                cm.sendNext("口当,你都答对了.虽然我不喜欢人类,但是我承诺的, 给你#b#z4031064#.")
            }
        } else if (status == 8 && mode == 1) { //gain marble
            cm.gainItem(4031064, 1);
            cm.sendOk("我们的交易已经结束，非常感谢！你可以离开了！");
            cm.dispose();
        } else if (status >= 2 && status <= 6 && mode == 1) {//questions
            var cont = true;
            if (status > 2) {
                if (selection != correctAnswer.pop()) {
                    cm.sendNext("嗯...不管怎么样人总会出错! 如果想再试试,再给我300个炸鸡.")
                    cm.dispose();
                    cont = false;
                }
            }
            if (cont) {
                questionNum = Math.floor(Math.random() * questions.length);
                if (questionNum != (questions.length - 1)) {
                    var temp;
                    temp = questions[questionNum];
                    questions[questionNum] = questions[questions.length - 1];
                    questions[questions.length - 1] = temp;
                    temp = answers[questionNum];
                    answers[questionNum] = answers[questions.length - 1];
                    answers[questions.length - 1] = temp;
                    temp = correctAnswer[questionNum];
                    correctAnswer[questionNum] = correctAnswer[questions.length - 1];
                    correctAnswer[questions.length - 1] = temp;
                }
                var question = questions.pop();
                var answer = answers.pop();
                var prompt = "第" + (status - 1) + "题: " + question;
                for (var i = 0; i < answer.length; i++) {
                    prompt += "\r\n#b#L" + i + "#" + answer[i] + "#l#k";
                }
                cm.sendSimple(prompt);
            }
        }
    }
}