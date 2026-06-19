/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc> 
                       Matthias Butz <matze@odinms.de>
                       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License version 3
    as published by the Free Software Foundation. You may not use, modify
    or distribute this program under any other version of the
    GNU Affero General Public License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var toMap = [211040200, 220050300, 220000000, 240030000];
var inMap = [211000000, 220000000, 221000000, 240000000];
var cost = [10000, 10000, 25000, 65000];
var location;
var status;
// 自定义状态变量（必须在顶层声明）
var awaitingSelection = false;
var awaitingConfirmation = false;
var customDest = null;
var customCost = 0;

function start() {
    status = -1;
    // 重置自定义状态，避免上次对话残留
    awaitingSelection = false;
    awaitingConfirmation = false;
    customDest = null;
    customCost = 0;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
        return;
    }
    // 处理在确认对话框中选择“否”（mode == 0 && awaitingConfirmation）
    if (mode == 0 && awaitingConfirmation) {
        cm.sendNext("嗯，请仔细考虑一下。这不便宜，但您绝对不会对我们的顶级服务感到失望！");
        cm.dispose();
        return;
    }
    // 其他取消情况
    if (mode == 0 && type > 0) {
        cm.sendNext("嗯，请仔细考虑一下。这不便宜，但您绝对不会对我们的顶级服务感到失望！");
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    } else {
        status--;
    }

    var currentMap = cm.getPlayer().getMap().getId();

    // 处理等待选择状态（已经显示目的地列表）
    if (awaitingSelection) {
        awaitingSelection = false;
        if (currentMap == 211000000) {
            if (selection == 0) {
                customDest = 211040200;
                customCost = 10000;
            } else if (selection == 1) {
                customDest = 211060000;
                customCost = 50000;
            }
            cm.sendYesNo("你想支付 #b" + customCost + " 金币#k 前往 #b#m" + customDest + "##k 吗？");
            awaitingConfirmation = true;
            return;
        }
    }

    // 处理等待确认状态（已经显示确认对话框）
    if (awaitingConfirmation) {
        awaitingConfirmation = false;
        if (currentMap == 211000000) {
            if (mode == 1) { // 玩家选择了“是”
                if (cm.getMeso() < customCost) {
                    cm.sendNext("你似乎没有足够的金币。非常抱歉，除非你付款，否则我无法帮助你。多打怪赚更多金币，等你有足够的金币再回来吧。");
                } else {
                    cm.gainMeso(-customCost);
                    cm.warp(customDest, 0);
                }
            } else { // 玩家选择了“否”，但已在上面处理过
                cm.sendNext("嗯，请仔细考虑一下。这不便宜，但您绝对不会对我们的顶级服务感到失望！");
            }
            cm.dispose();
            return;
        }
    }

    // 正常流程（非211000000地图，或者第一次进入）
    if (status == 0) {
        var foundIndex = -1;
        for (var i = 0; i < inMap.length; i++) {
            if (inMap[i] == currentMap) {
                foundIndex = i;
                break;
            }
        }
        if (currentMap == 211000000) {
            cm.sendSimple("请选择您要去的地方：\r\n#L0##b#m211040200##k#l\r\n#L1##b#m211060000##k#l");
            awaitingSelection = true;
            return;
        } else if (foundIndex != -1) {
            location = foundIndex;
            cm.sendNext("你好！这辆出租车会比箭头飞得更快，把你带到你想去的危险地方！我们从#m" + inMap[location] + "#到#b#m" + toMap[location] + "##k去！费用是#b" + cost[location] + " 枚金币#k。我知道有点贵，但能避开所有危险区域，绝对物有所值！");
        } else {
            cm.sendNext("抱歉，我不认识这里。");
            cm.dispose();
        }
    } else if (status == 1) {
        // 非211000000地图的确认步骤
        cm.sendYesNo("你想支付 #b" + cost[location] + " 金币#k 前往 #b#m" + toMap[location] + "##k 吗？");
    } else if (status == 2) {
        // 非211000000地图的传送步骤
        if (cm.getMeso() < cost[location]) {
            cm.sendNext("你似乎没有足够的金币。非常抱歉，除非你付款，否则我无法帮助你。多打怪赚更多金币，等你有足够的金币再回来吧。");
        } else {
            cm.gainMeso(-cost[location]);
            cm.warp(toMap[location], location != 1 ? 0 : 1);
        }
        cm.dispose();
    }
}