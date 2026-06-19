/*
    This file is part of the HeavenMS MapleStory Server
    Copyleft (L) 2016 - 2019 RonanLana

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
/**
 * @author: Ronan
 * @npc: Abdula
 * @map: Multiple towns on Maplestory
 * @func: Job Skill / Mastery Book Drop Announcer
 */

var status;
var selected = 0;
var skillbook = [], masterybook = [], table = [];

function start() {
    status = -1;
    selected = 0;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            var greeting = "你好！我是#p9209000#, 技能书和能手册宣传员! ";
            
            if(cm.getPlayer().isCygnus()) {
                cm.sendOk(greeting + "骑士团没有技能书或能手册！");
                cm.dispose();
                return;
            }

            var jobrank = cm.getJob().getId() % 10;
            if(jobrank < 2) {
                cm.sendOk(greeting + "请继续训练自己直到#r四转#k。当你达到这一壮举时，新的进步机会就会到来！");
                cm.dispose();
                return;
            }

            skillbook = cm.getAvailableSkillBooks();
            masterybook = cm.getAvailableMasteryBooks();

            if(skillbook.length == 0 && masterybook.length == 0) {
                cm.sendOk(greeting + "目前没有书籍可以进一步提高你的技能。要么你已经#b完成了全部技能#k，或者#b你还没有达到使用一些技能书的最低要求#k。");
                cm.dispose();
            } else if(skillbook.length > 0 && masterybook.length > 0) {
                var sendStr = greeting + "技能提升的新机会已经为您找到，可以让您提高技能！请选择要查看的类型。\r\n\r\n#b";

                sendStr += "#L1# Skill Book#l\r\n";
                sendStr += "#L2# Mastery Book#l\r\n";

                cm.sendSimple(sendStr);
            } else if (skillbook.length > 0) {
                selected = 1;
                cm.sendNext(greeting + "技能提升的新机会已经为您找到，可以让您提高技能！目前有新的技能可学习。");
            } else {
                selected = 2;
                cm.sendNext(greeting + "技能提升的新机会已经为您找到，可以让您提高技能！目前有技能可以升级。");
            }

        } else if (status == 1) {
            var sendStr = "以下数据现在可用:\r\n\r\n";
            if (selected == 0) {
                selected = selection;
            }

            if (selected == 1) {
                table = skillbook;
                for (var i = 0; i < table.length; i++) {
                    if (table[i] > 0) {
                        var itemid = table[i];
                        sendStr += "  #L" + i + "# #i" + itemid + "#  #t" + itemid + "##l\r\n";
                    } else {
                        var skillid = -table[i];
                        sendStr += "  #L" + i + "# #s" + skillid + "#  #q" + skillid + "##l\r\n";
                    }
                }
            } else {
                table = masterybook;
                for (var i = 0; i < table.length; i++) {
                    var itemid = table[i];
                    sendStr += "  #L" + i + "# #i" + itemid + "#  #t" + itemid + "##l\r\n";
                }
            }

            cm.sendSimple(sendStr);

        } else if (status == 2) {
            selected = selection;

            var sendStr;
            if (table[selected] > 0) {
                var mobList = cm.getNamesWhoDropsItem(table[selected]);
                
                if(mobList.length == 0) {
                    sendStr = "没有怪物掉落 '#b#t" + table[selected] + "##k'.\r\n\r\n";
                } else {
                    sendStr = "以下怪物掉落 '#b#t" + table[selected] + "##k':\r\n\r\n";

                    for (var i = 0; i < mobList.length; i++) {
                        sendStr += "  #L" + i + "# " + mobList[i] + "#l\r\n";
                    }

                    sendStr += "\r\n\r\n";
                }
            } else {
                sendStr = "\r\n\r\n";
            }

            sendStr += cm.getSkillBookInfo(table[selected]);

            cm.sendNext(sendStr);
            cm.dispose();
        }
    }
}