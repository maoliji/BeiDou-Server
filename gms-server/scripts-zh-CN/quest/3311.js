/*
    This file is part of the HeavenMS MapleStory Server
    Copyleft (L) 2016 - 2018 RonanLana

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

function end(mode, type, selection) {
    if (mode == -1) {
        qm.dispose();
    } else {
        if(mode == 0 && type > 0) {
            qm.dispose();
            return;
        }
        
        if (mode == 1)
            status++;
        else
            status--;
        
        if (status == 0) {
            if(qm.getQuestProgress(3311, 0) == 1 && qm.getQuestProgress(3311, 1) == 1) {
                qm.sendNext("嗯，那么卡帕莱特的博士写了一些关于研究一些先锋派的新型洛伊德机器人的文章，它可以击败现有的机器人，这是为了准备研究的最后一步？我们已经三个星期没有他的消息了，一定是出了什么问题...");
                qm.gainExp(60000);
                qm.forceCompleteQuest();
            } else {
                qm.sendNext("什么也没发现？请仔细检查德朗博士的房子，那里可能会透露出发生了什么事情的线索。");
            }
            
            qm.dispose();
        }
    }
}