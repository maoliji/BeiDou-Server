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
/* Mar the Fairy
	Handles Water of Life
 */

var status;
var dList;

function start() {
    status = -1;
    dList = cm.getDriedPets();
    if (dList.size() == 0) {
        cm.playerMessage(5, "你现在没有需要使用生命之水的宠物.");
        cm.dispose();
        return;
    }

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
            cm.sendYesNo("我是妖精玛丽.你有#b生命之水#k... 我可以用这个使用魔法使宠物复活.你觉得怎么样 ...?");

        } else if (status == 1) {
            var talkStr = "你想让哪个宠物复活？请选择一个宠物...\r\n\r\n";

            var listStr = "";
            var i = 0;

            var dIter = dList.iterator();
            while (dIter.hasNext()) {
                var dPet = dIter.next();

                listStr += "#b#L" + i + "# " + dPet.getName() + " #k - Lv " + dPet.getLevel() + " 亲密度 " + dPet.getTameness();
                listStr += "#l\r\n";

                i++;
            }

            cm.sendSimple(talkStr + listStr);
        } else if (status == 2) {
            var sPet = dList.get(selection);

            if (sPet != null) {
                cm.sendNext("你的宠物现在已经重获新生！不过，我的魔法并不完美，所以我不能保证你的宠物会永生……请在生命之水干涸之前好好照顾你的宠物。那么，再见……");

                const InventoryType = Java.type('org.gms.client.inventory.InventoryType');
                var it = cm.getPlayer().getInventory(InventoryType.CASH).getItem(sPet.getPosition());
                it.setExpiration(Date.now() + (1000 * 60 * 60 * 24 * 90));
                cm.getPlayer().forceUpdateItem(it);

                cm.gainItem(5180000, -1);
            } else {
                cm.sendNext("哦，那好吧。再见…");
            }

            cm.dispose();
        }
    }
}