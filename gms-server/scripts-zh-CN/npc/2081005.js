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
//@Author Moogra, Ronan
//Fixed grammar, javascript syntax

var status;
var price = 100000;
var cost = 1000000;

function isTransformed(ch) {
    const BuffStat = Java.type('org.gms.client.BuffStat');
    return ch.getBuffSource(BuffStat.MORPH) == 2210003;
}

function start() {
    status = 0;


    //if (!( isTransformed(cm.getPlayer()) || cm.haveItem(4001086) || ( cm.haveItem(4001083) && cm.haveItem(4001084) && cm.haveItem(4001085) ) ) ) {
     //   cm.sendNext("这是暗黑龙王的洞穴，他是米纳尔森林的至高统治者。只有那些被认为值得见他的人才能通过这里，外来者是不受欢迎的。滚开！\r\n除非...#b你给我点好处...#k");
     //   return;
    //}
    
    cm.sendSimple("这是暗黑龙王的洞穴，他是米纳尔森林的至高统治者。只有那些被认为值得见他的人才能通过这里，外来者是不受欢迎的。滚开！\r\n除非...#b你给我点好处...#k\r\n#L1#我想直接进去!#l\r\n\#L2#我要花100000金币购买10个#v2000005#!#l");
}

function action(mode, type, selection) {


    if (mode < 1) {
        cm.dispose();
        return;
    } 
        if (mode == 1) {
            status++;
        } else {
            status--;
        }    
        if (selection == 1) {
    
      if (!( isTransformed(cm.getPlayer()) || cm.haveItem(4001086) || ( cm.haveItem(4001083) && cm.haveItem(4001084) && cm.haveItem(4001085) ) ) ) {
        cm.sendYesNo("你没有资格进入，除非你给我#b100W金币！#k\r\n还要进去吗？");

        } else if (cm.getLevel() > 99) { //有敢死队象征，可直接进入
            cm.warp(240050000, 0);
        } else {
            cm.sendOk("您需要至少达到100级或以上才能进入！");
            cm.dispose();
        }

    } else if (selection == 2) {
        if (cm.getMeso() >= price) {
            if (!cm.canHold(2000005)) {
                cm.sendOk("你的背包里没有空位来存放这个物品！");
        	cm.dispose();
            } else {
                cm.gainMeso(-price);
                cm.gainItem(2000005, 10);
                cm.sendOk("好好使用这些药水吧！");
        	cm.dispose();
            }
        } else {
            cm.sendOk("你没有足够的金币来购买它们！");
            cm.dispose();
        }

	
    } else if (status == 2){
        if (cm.getLevel() > 99) {
            cm.gainMeso(-cost);	    
            cm.warp(240050000, 0);
        } else {
            cm.sendOk("您需要至少达到100级或以上才能进入！");
	
        }

    } else {
        cm.dispose();

    }
}
