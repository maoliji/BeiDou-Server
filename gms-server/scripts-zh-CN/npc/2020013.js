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

status = -1;
var job;
var sel;
actionx = {"Mental": false, "Physical": false};

function start() {
    var jobBase = parseInt(cm.getJobId() / 100);
    var jobStyle = 5;
    if (!(cm.getPlayer().getLevel() >= 70 && jobBase == jobStyle && cm.getJobId() % 10 == 0)) {
        if (cm.getPlayer().getLevel() >= 50 && jobBase % 10 == jobStyle) {
            status++;
            action(1, 0, 1);
            return;
        }

        cm.sendNext("你好。");
        cm.dispose();
        return;
    }
    if (cm.haveItem(4031058)) {
        actionx["Mental"] = true;
    } else if (cm.haveItem(4031057)) {
        actionx["Physical"] = true;
    }
    cm.sendSimple("我可以帮你吗？#b" + (cm.getJobId() % 10 == 0 ? "\r\n#L0#我想进行第三次职业转职。" : "") + "\r\n#L1#请允许我进行扎昆地牢任务。");
}

function action(mode, type, selection) {
    status++;
    if (mode == 0 && type == 0) {
        status -= 2;
    } else if (mode != 1 || (status > 2 && !actionx["Mental"]) || status > 3) {
        if (mode == 0 && type == 1) {
            cm.sendNext("下定决心。");
        }
        cm.dispose();
        return;
    }
    if (actionx["Mental"]) {
        if (status == 0) {
            cm.sendNext("做得好，完成了测试的思维部分。你明智地回答了所有的问题。我必须说，你展现出的智慧水平让我印象深刻。在我们进行下一步之前，请先把项链交给我。");
        } else if (status == 1) {
            cm.sendYesNo("好的！现在，通过我，你将变成一个更强大的海盗。在这之前，请确保你的SP已经被充分使用了，你需要至少使用到70级之前获得的所有SP来进行第三次职业转职。哦，还有，由于你已经在第二次职业转职时选择了你的职业方向，所以在第三次职业转职时就不需要再次选择了。你现在要进行转职吗？");
        } else if (status == 2) {
            if (cm.getPlayer().getRemainingSp() > 0) {
                if (cm.getPlayer().getRemainingSp() > (cm.getLevel() - 70) * 3) {
                    cm.sendNext("请在继续之前使用你所有的技能点SP。");
                    cm.dispose();
                    return;
                }
            }
            if (cm.getJobId() % 10 == 0) {
                cm.gainItem(4031058, -1);
                cm.changeJobById(cm.getJobId() + 1);
                cm.getPlayer().removePartyQuestItem("JBQ");
            }

            if (Math.floor(cm.getJobId() / 10) == 51) {
                cm.sendNext("太好了！你现在是#b斗士#k了.关于斗士, 你将学习一些与近战攻击相关的最高级技能。#b能量获得#k是一种技能，允许你储存你的力量和伤害，你收到一种特殊形式的能量。一旦这个能量球充满电，你可以使用#b能量爆破#k对敌人造成最大伤害，同时使用#b能量耗转#k偷你敌人的生命来恢复你自己的生命。#b超人变身#k将允许你转化为一个具有毁灭性近战攻击的超人，并且在转化的同时，你可以使用#b冲击波#k引起一场小地震并对你的敌人造成巨大的伤害。");
            } else {
                cm.sendNext("太好了！你现在是#b大副#k了.作为一个大副，你将成为一个真正的火枪手，每一个已知的枪械攻击，以及一些其他技能，帮助你战胜邪恶。#b双管枪射击#k是一个更强大的版本的双重射击，射击更多的子弹，同时造成更多的伤害。你现在也有能力召唤一个忠诚的#b章鱼炮台#k以及俯冲#b海欧空袭#k作为你信任的盟友，在你用#b靶心#k攻击敌人时. 也可以使用基于元素的攻击#b烈焰喷射#k和#b寒冰喷射#k。");
            }
        } else if (status == 3) {
            cm.sendNextPrev("我也给了你一些技能点和能力值，这将帮助你开始。你现在确实成为了一个强大的海盗。但请记住，现实世界将等待着你，那里会有更艰难的障碍需要克服。当你觉得自己无法训练自己达到更高的境界时，那时候，只有那时候，来找我。我会在这里等着你。");
        }
    } else if (actionx["Physical"]) {
        if (status == 0) {
            cm.sendNext("完成了测试的体能部分，做得很棒。我知道你能做到。现在你已经通过了测试的前半部分，接下来是后半部分。请先把项链给我。");
        } else if (status == 1) {
            if (cm.haveItem(4031057)) {
                cm.gainItem(4031057, -1);
                cm.getPlayer().setPartyQuestItemObtained("JBQ");
            }
            cm.sendNextPrev("这是测试的第二部分。这个测试将决定你是否足够聪明，可以迈向伟大的下一步。在Ossyria的雪地上有一个被雪覆盖的黑暗区域，被称为圣地，甚至怪物也无法到达。在这个区域的中心，有一块被称为圣石的巨大石头。你需要献上一件特殊的物品作为祭品，然后圣石将在当场测试你的智慧。");
        } else if (status == 2) {
            cm.sendNextPrev("你需要诚实而坚定地回答每一个问题。如果你能正确回答所有问题，那么圣石将正式接受你，并交给你#b#t4031058##k。把项链带回来，我会帮助你迈向下一步。祝你好运。");
        }
    } else if (cm.getPlayer().gotPartyQuestItem("JB3") && selection == 0) {
        cm.sendNext("去，和#b#p1090000# #k交谈，然后给我带来#b#t4031057##k。");
        cm.dispose();
    } else if (cm.getPlayer().gotPartyQuestItem("JBQ") && selection == 0) {
        cm.sendNext("去，和#b#p2030006#对话#k，然后给我带来#b#t4031058##k。");
        cm.dispose();
    } else {
        if (sel == undefined) {
            sel = selection;
        }
        if (sel == 0) {
            if (cm.getPlayer().getLevel() >= 70 && cm.getJobId() % 10 == 0) {
                if (status == 0) {
                    cm.sendYesNo("欢迎。我是#b#p2020013##k，所有海盗的首领，负责引导每一个需要帮助的海盗发挥出最好的潜力。你看起来像是那种想要迈出进步的海盗，准备迎接第三职业转职挑战的人。但我见过无数渴望像你一样迈出这一步的海盗，最终却失败了。你呢？你准备好接受考验，进行第三职业转职了吗？");
                } else if (status == 1) {
                    cm.getPlayer().setPartyQuestItemObtained("JB3");
                    cm.sendNext("好的。你将在海盗的两个重要方面进行测试：力量和智慧。我现在会向你解释测试的身体部分。还记得来自诺特勒斯港的#b#p1090000##k吗？去找他，他会告诉你测试的第一部分的详细信息。请完成任务，并从#p1090000#那里获得#b#t4031057##k。");
                } else if (status == 2) {
                    cm.sendNextPrev("测试的心理部分只能在你通过了测试的身体部分之后才能开始。#b#t4031057##k 将证明你确实通过了测试。我会提前告诉#b#p1022000##k你要前往那里，所以做好准备。这不会很容易，但我对你有着最大的信心。祝你好运。");
                }
            }
        } else {
            if (cm.getPlayer().getLevel() >= 50) {
                cm.sendOk("长老员会授予你#b特许#k，成为#r反击扎昆团队#k的一部分。祝你一切顺利。");
                if (!(cm.isQuestStarted(100200) || cm.isQuestCompleted(100200))) {
                    cm.startQuest(100200);
                }
                const GameConfig = Java.type('org.gms.config.GameConfig');
                if (GameConfig.getServerBoolean("use_enable_solo_expeditions") && !cm.isQuestCompleted(100201)) {
                    cm.completeQuest(100201);
                }
            } else {
                cm.sendOk("你太弱了，无法挑战#r扎昆#k. 至少达到#b50级#k以后，再与我交谈。");
            }
            cm.dispose();
        }
    }
}