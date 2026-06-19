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
 * @npc: Shuang
 * @map: Victoria Road: Excavation Site<Camp> (101030104)
 * @func: Start Guild PQ
 */

var status = 0;
var sel;
var em = null;

function findLobby(guild) {
    for (var iterator = em.getInstances().iterator(); iterator.hasNext();) {
        var lobby = iterator.next();

        if (lobby.getIntProperty("guild") == guild) {
            if (lobby.getIntProperty("canJoin") == 1) {
                return lobby;
            } else {
                return null;
            }
        }
    }

    return null;
}

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            em = cm.getEventManager("GuildQuest");
            if (em == null) {
                cm.sendOk("家族任务遇到了一个错误。");
                cm.dispose();
                return;
            }

            cm.sendSimple("#e#b<家族任务：圣端尼亚遗迹>\r\n#k#n" + em.getProperty("party") + "\r\n\r\n通往圣端尼亚的道路就在这里。你想做什么？#b\r\n#L0#登记家族进行家族任务#l\r\n#L1#加入你的家族任务#l\r\n#L2#我想了解更多细节。#l");
        } else if (status == 1) {
            sel = selection;
            if (selection == 0) {
                if (!cm.isGuildLeader()) {
                    cm.sendOk("必须由你的家族族长/副族长与我交谈，以登记家族参加家族任务。");
                    cm.dispose();
                } else {
                    if (em.isQueueFull()) {
                        cm.sendOk("这个频道的队列已经满了。请耐心等待一会儿，然后再试一次，或者尝试在另一个频道。");
                        cm.dispose();
                    } else {
                        var qsize = em.getQueueSize();
                        cm.sendYesNo(((qsize > 0) ? "当前有 #r" + qsize + "#k 个家族在队列中. " : "") + "你想让你的家族排队吗?");
                    }
                }
            } else if (selection == 1) {
                if (cm.getPlayer().getGuildId() > 0) {
                    var eim = findLobby(cm.getPlayer().getGuildId());
                    if (eim == null) {
                        cm.sendOk("你的家族目前不在此频道上进行战略时间。请再次检查你的家族是否正在计划家族任务，如果是的话，请确认他们分配的频道。");
                    } else {
                        if (cm.isLeader()) {
                            em.getEligibleParty(cm.getParty());
                            eim.registerParty(cm.getPlayer());
                        } else {
                            eim.registerPlayer(cm.getPlayer());
                        }
                    }
                } else {
                    cm.sendOk("如果你没有加入家族，就无法参与家族任务！");
                }

                cm.dispose();
            } else {
                var reqStr = "";
                                reqStr += "\r\n\r\n    队伍需求:\r\n\r\n";
                                reqStr += "     - 1名队员 #r等级低于或等于30级#k.\r\n";
                                reqStr += "     - 1名队员 #r轻功学满并且会隐身的飞侠#k.\r\n";
                                reqStr += "     - 1名队员 #r学满瞬间移动的法师#k.\r\n";
                                reqStr += "     - 1名队员 #r远程攻击职业,比如弓箭手,刺客或者枪手#k.\r\n";
                                reqStr += "     - 1名队员 #r拥有很好机动性的职业,比如会二段跳的飞侠,会轻羽鞋的海盗#k.\r\n";


                cm.sendOk("#e#b<家族任务：圣端尼亚遗迹>#k#n\r\n与你的家族成员一起合作，试图从骷髅的掌控中夺回鲁碧安，通过团队合作克服圣端尼亚遗迹内等待的许多谜题和挑战。完成任务后可以获得丰厚的奖励，并为你的家族积累家族点数。");
                cm.dispose();
            }
        } else if (status == 2) {
            if (sel == 0) {
                var entry = em.addGuildToQueue(cm.getPlayer().getGuildId(), cm.getPlayer().getId());
                if (entry > 0) {
                    cm.sendOk("您的家族已成功登记。一条消息将在您的聊天窗口中弹出，让您的家族了解登记状态。\r\n#r重要#k：作为这个活动的领袖，#r在家族被召集进行策略时，您必须在该频道上#k。#b未能完成此操作#k将使您的家族活动登记作废，并立即召集下一个家族。还必须注意的是，作为这个活动的领袖，如果您从策略时间结束到活动持续时间的任何时刻不在场，将使任务中断，并立即将您的家族移出队列。");
                } else if (entry == 0) {
                    cm.sendOk("这个频道的队列已经满了。请耐心等待一会儿，然后再试一次，或者尝试在另一个频道。");
                } else {
                    cm.sendOk("您的家族已经在一个频道排队了。请等待您的家族轮到。");
                }
            }

            cm.dispose();
        }
    }
}