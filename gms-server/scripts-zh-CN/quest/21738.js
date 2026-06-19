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

var status = -1;

function start(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            qm.dispose();
            return;
        }

        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {  // thanks ZERO傑洛 for noticing this quest shouldn't need a pw -- GMS-like string data thanks to skycombat
            qm.sendNext("嗯，你有什么事？");
        } else if (status == 1) {
            qm.sendNext("(你告诉了她巨大食人花的事情。)", 3);
        } else if (status == 2) {
            qm.sendNext("巨大食人花?问题很大,但我觉得没啥影响。 等会儿, 你再说一下在哪儿有巨大食人花?", 9);
        } else if (status == 3) {
            qm.sendNext("人迹罕至的道路上。", 3);
        } else if (status == 4) {
            qm.sendNext("...人迹罕至的道路上? 如果是在那里, 就是有人想闯入被封印的庭院! 但为啥呢? 会是谁！?", 9);
        } else if (status == 5) {
            qm.sendNext("封印的庭院?", 3);
        } else if (status == 6) {
            qm.sendAcceptDecline("我不能告诉你关于那儿的事. 如果你非要知道, 我必须看看你有没有知晓这一切的价值. 让我为你占卜，好吗？", 9);
        } else if (status == 7) {
            qm.sendOk("好！让我看看你的命运吧！");
        } else if (status == 8) {
            qm.forceStartQuest();
            qm.dispose();
        }
    }
}
