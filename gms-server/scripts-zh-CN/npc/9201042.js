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
/* Mr. Sandman
	Amoria - Amoria (680000000)
	AmoriaPQ Extras (get wish tickets in AmoriaPQ bonus stage)

        Yellow Wish Ticket - Lv1 ~ 49
         Green Wish Ticket - Lv50 ~ 119
          Blue Wish Ticket - Lv120+
 */

var wishPrizes = [2022007, 2022244,2020031, 2020011, 2000004, 2022015, 2000005, 2022251, 2012008,2022179,2022121, 2022123, 2022273, 2022282];
var wishPrizesQty = [100, 100,100 , 100, 100, 100, 100, 10, 10, 1, 1, 1, 1, 1];
var wishPrizesCst = [5, 7 ,8 , 10, 12, 16, 20, 10, 20, 40, 50, 20, 10, 50];

var slctTicket;
var amntTicket;

var sel;
var advance = true;

var status;

function getTierTicket(level) {
    if (level < 50) {
        return 4031543;
    } else if (level < 120) {
        return 4031544;
    } else {
        return 4031545;
    }
}

function start() {
    slctTicket = getTierTicket(cm.getPlayer().getLevel());
    amntTicket = cm.getItemQuantity(slctTicket);

    status = -1;
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
        if (mode == 1 && advance) {
            status++;
        } else {
            status--;
        }

        advance = true;

        if (status == 0) {
            cm.sendNext("嗨，你好吗？既然你路过婚礼村，你听说过我哥哥阿莫斯主持的副本吗？这就是 #b婚礼村挑战#k，一个供40级以上玩家参与的副本。\r\n\r\n在那里，你可以找到 #i4031543# #i4031544# #i4031545# #b希望票#k，可以带到这里兑换奖品。");
        } else if (status == 1) {
            var listStr = "";
            for (var i = 0; i < wishPrizes.length; i++) {
                listStr += "#b#L" + i + "#" + wishPrizesQty[i] + " #z" + wishPrizes[i] + "##k";
                listStr += " - " + wishPrizesCst[i] + "个希望票";
                listStr += "#l\r\n";
            }

            cm.sendSimple("您目前拥有#b" + amntTicket + "张 #i" + slctTicket + "# #t" + slctTicket + "##k。\r\n\r\n购买奖品：\r\n\r\n" + listStr);
        } else if (status == 2) {
            sel = selection;

            if (amntTicket < wishPrizesCst[selection]) {
                cm.sendPrev("You will need #b" + wishPrizesCst[selection] + " #t" + slctTicket + "##k to purchase that! If you want this, come back another time when you have all the tickets at hand.");
                advance = false;
            } else {
                cm.sendYesNo("您已选择#b" + wishPrizesQty[selection] + " #z" + wishPrizes[selection] + "##k，这将需要#b" + wishPrizesCst[selection] + " #t" + slctTicket + "##k。您要购买吗？");
            }
        } else {
            if (cm.canHold(wishPrizes[sel], wishPrizesQty[sel])) {
                cm.gainItem(wishPrizes[sel], wishPrizesQty[sel]);
                cm.gainItem(slctTicket, -wishPrizesCst[sel]);

                cm.sendOk("祝你一天愉快！");
            } else {
                cm.sendOk("领取物品前，请确保您的背包有足够的空位。");
            }

            cm.dispose();
        }
    }
}