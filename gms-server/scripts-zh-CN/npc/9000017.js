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
/* Coco
        Refining NPC: 
	* Chaos scroll SYNTHETIZER (rofl)
        * 
        * @author RonanLana (ronancpl)
*/

var status = 0;
var selectedType = -1;
var selectedItem = -1;
var item;
var mats;
var matQty;
var cost;
var qty;
var equip;
var last_use; //last item is a use item

function start() {
    cm.getPlayer().setCS(true);
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.sendOk("哦，好吧... 你想做生意的时候再来找我们吧。");
        cm.dispose();
        return;
    }

    if (status == 0) {
        const GameConfig = Java.type('org.gms.config.GameConfig');
        if (!GameConfig.getServerBoolean("use_enable_custom_npc_script")) {
            cm.sendOk("嗨，我是 #b#p" + cm.getNpc() + "##k。");
            cm.dispose();
            return;
        }

        var selStr = "嘿，旅行者！过来，靠近一点...我们为您提供#b一个大商机#k。如果你想知道它是什么，请继续听...";
        cm.sendNext(selStr);
    } else if (status == 1) {
        var selStr = "我们已经掌握了合成强大的#b#t2049100##k的知识！当然，制作一个并非易事。..但别担心！只需为我收集一些材料，并支付#b200000金币#k，用于我们的服务来获得它。你还想这样做吗？";
        cm.sendYesNo(selStr);
    } else if (status == 2) {
        //selectedItem = selection;
        selectedItem = 0;

        var itemSet = [2049100, 7777777];
        var matSet = new Array([4031203, 4001356, 4000136, 4000082, 4001126, 4080100, 4000021, 4003005]);
        var matQtySet = new Array([100, 60, 40, 80, 10, 8, 200, 120]);
        var costSet = [1200000, 7777777];
        item = itemSet[selectedItem];
        mats = matSet[selectedItem];
        matQty = matQtySet[selectedItem];
        cost = costSet[selectedItem];

        var prompt = "所以，你想让我们做一些#t" + item + "#?那样的话，你想让我们做多少？";
        cm.sendGetNumber(prompt, 1, 1, 100)
    } else if (status == 3) {
        qty = (selection > 0) ? selection : (selection < 0 ? -selection : 1);
        last_use = false;

        var prompt = "你想我们制造";
        if (qty == 1) {
            prompt += "一张#t" + item + "#？";
        } else {
            prompt += qty + "张#t" + item + "#？";
        }

        prompt += "我们需要您提供特定的物品才能完成。另外，请确保您的背包中有足够的空间。#b";

        if (mats instanceof Array) {
            for (var i = 0; i < mats.length; i++) {
                prompt += "\r\n#i" + mats[i] + "# " + matQty[i] * qty + " #t" + mats[i] + "#";
            }
        } else {
            prompt += "\r\n#i" + mats + "# " + matQty * qty + " #t" + mats + "#";
        }

        if (cost > 0) {
            prompt += "\r\n#i4031138# " + cost * qty + "金币";
        }
        cm.sendYesNo(prompt);
    } else if (status == 4) {
        var complete = true;

        if (cm.getMeso() < cost * qty) {
            cm.sendOk("快点！我们不是来帮你的忙的！我们都需要钱来过好生活，所以拿钱来让我们做成交并开始合成。");
        } else if (!cm.canHold(item, qty)) {
            cm.sendOk("在我们交易之前，你没有检查一下你的背包里是否有空位吗？");
        } else {
            if (mats instanceof Array) {
                for (var i = 0; complete && i < mats.length; i++) {
                    if (matQty[i] * qty == 1) {
                        complete = cm.haveItem(mats[i]);
                    } else {
                        complete = cm.haveItem(mats[i], matQty[i] * qty);
                    }
                }
            } else {
                complete = cm.haveItem(mats, matQty * qty);
            }

            if (!complete) {
                cm.sendOk("你在开玩笑吧？没有所有的材料在手，我们将无法启动这个过程。去把它们都拿来，然后再来找我们谈！");
            } else {
                if (mats instanceof Array) {
                    for (var i = 0; i < mats.length; i++) {
                        cm.gainItem(mats[i], -matQty[i] * qty);
                    }
                } else {
                    cm.gainItem(mats, -matQty * qty);
                }
                cm.gainMeso(-cost * qty);
                cm.gainItem(item, qty);
                cm.sendOk("哇... 真不敢相信它起作用了！想想一会儿它竟然能够... 咳咳。当然它起作用了，我们所有的工作都非常高效！很高兴和你做生意。");
            }
        }
        cm.dispose();
    }
}