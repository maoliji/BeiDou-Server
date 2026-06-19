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
/* NPC: Donation Box (9000041)
    Victoria Road : Henesys
	
    NPC Bazaar:
        * @author Ronan Lana
*/
// 道具回收
// var options = ["装备栏","消耗栏","设置栏","其他栏"];
// var name;
// var status;
// var selectedType = 0;

// function start() {
//     status = -1;
//     action(1, 0, 0); 
// }

// function action(mode, type, selection) {
//     status++;
//     if (mode != 1) {
//         cm.dispose();
//         return;
//     }

//     if (status == 0) {
//        /* if (!Packages.config.YamlConfig.config.server.USE_ENABLE_CUSTOM_NPC_SCRIPT) {
//             cm.sendOk("奖牌系统当前不可用...");
//             cm.dispose();
//             return;
//         }*/

//         var selStr = "你好,我是#b道具回收桶#k! 你可以把任意你不需要的道具出售给我. #r警告#b:确保你所选的道具在你的背包中.#k选择的所有道具都会被回收.";
//         for (var i = 0; i < options.length; i++)
//             selStr += "\r\n#L" + i + "# " + options[i] + "#l";
//         cm.sendSimple(selStr);
//     }

//     else if (status == 1) {
// 	selectedType = selection;
//         cm.sendGetText("你想回收#r" + options[selectedType] + "#k里什么道具?");
//     }

//     else if (status == 2) {
//         name = cm.getText();
// 	var res = cm.getPlayer().sellAllItemsFromName(selectedType + 1, name);
//         if(res > -1) cm.sendOk("回收完成!你获得了#r" + cm.numberWithCommas(res) + " 金币#k.");
// 	else cm.sendOk("你没有#b'" + name + "'!");

//         cm.dispose();
//     }
// }
//全服等级火药桶
/*var status;
var sel1;
var need;
var 笑脸=  "#fUI/GuildBBS.img/GuildBBS/Emoticon/Basic/2#";
function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    status++;
    if (mode != 1) {
        cm.dispose();
        return;
    }

    if (status == 0) {
        need = cm.getPlayer().serverNeed();
        if (need.isEmpty()) {
            cm.sendOk("#e#b感谢您在游戏的不懈努力,现在已经解锁了全部等级,不再需要收集道具了");
            cm.dispose();
        } else {
            var text = "你好，我是服务器收集NPC,我的工作是收集玩家战利品,收集到一定数量之后服务器最高等级将会开放下一阶段";
            cm.sendNext(text);
        }
    }
    else if (status == 1) {
        var player = cm.getPlayer();
        var text = "#e#b当前服务器等级:" + player.serverMaxLevel() + "#n#k\r\n我们现在还需要这些道具:\r\n";
        need = player.serverNeed();
        for (var i in need) {
            var tri = need.get(i);
            if (tri.mid < tri.left)
                text += "#L" + i + "##i" + i + "##B" + (tri.mid / tri.left * 100) + "#  (" + tri.mid + "/" + tri.left + ")   " + "   #r#e提交物品#l#n#k\r\n\r\n";
            else
                text += "      #i" + i + "##B" + (tri.mid / tri.left * 100) + "#  (" + tri.mid + "/" + tri.left + ")   " + "\r\n\r\n";
        }
        cm.sendSimple(text);
    }
    else if (status == 2) {
        sel1 = selection;
        var prize = need.get(sel1).right;
        if (prize.left == 0)
            var text = "提交1个#i" + sel1 + "#可以得到" + prize.right + "金币,需要提交多少个?目前还需要" + (need.get(sel1).left - need.get(sel1).mid) + "个";
        else if (prize.left == 1)
            var text = "提交1个#i" + sel1 + "#可以得到" + prize.right + "点券,需要提交多少个?目前还需要" + (need.get(sel1).left - need.get(sel1).mid) + "个";
        else if (prize.left == 2)
            var text = "提交1个#i" + sel1 + "#可以得到" + prize.right + "抵用券,需要提交多少个?目前还需要" + (need.get(sel1).left - need.get(sel1).mid) + "个";
        else
            var text = "提交1个#i" + sel1 + "#可以得到" + prize.right + "个#i" + prize.left + "#,需要提交多少个?目前还需要" + (need.get(sel1).left - need.get(sel1).mid) + "个";
        cm.sendGetNumber(text, 1, 1, (need.get(sel1).left - need.get(sel1).mid));
    }
    else if (status == 3) {
        var player = cm.getPlayer();
        if (cm.haveItem(sel1, selection)) {
            cm.gainItem(sel1, -selection);
            var count = player.handleServerNeed(sel1, selection);
            if (count < 0)
                var text = "谢谢您的支持,现在#i" + sel1 + "#还需要" + (-count) + "个\r\n";
            else
                var text = "谢谢您的支持,现在#i" + sel1 + "#已经集齐了\r\n";
            var prize = need.get(sel1).right;
            text += "#e#b奖励:";
            var amount = prize.right * selection;
            if (prize.left == 0) {
                text += "金币 × " + amount;
                cm.gainMeso(amount);
            } else if (prize.left == 1) {
                text += "点券 × " + amount;
                player.gainNX(amount);
            } else if (prize.left == 2) {
                text += "抵用券 × " + amount;
                player.gainMp(amount);
            } else {
                text += "#i" + sel1 + "# × " + amount;
                player.gainMp(amount);
            }
            cm.sendOk(text);
        } else {
            cm.sendOk("你没有足够的道具");
        }
        cm.dispose();
    }
}*/
//枫叶兑换
var 武器35 = Array(1302020, 1382009, 1462014, 1472030, 1482020, 1492020);
var 武器43 = Array(1302030, 1332025, 1382012, 1412011, 1422014, 1432012, 1442024, 1452022, 1462019, 1472032, 1482021, 1492021);
var 武器64 = Array(1302064, 1312032, 1322054, 1332055, 1332056, 1372034, 1382039, 1402039, 1412027, 1422029, 1432040, 1442051, 1452045, 1462040, 1472055, 1482022, 1492022);
var 抽奖 = Array(4005000, 4005001, 4005002, 4005003, 1002419, 4005004, 4021000, 4021001, 4021002, 4021003, 4021004, 4021005, 4021006, 4021007, 4021008, 2002023, 2022121, 2022195, 2022439, 2022440, 2022441, 2022308, 2022307, 2002028, 2002029, 2022306, 2022305);
var 职业盾 = Array(1092045, 1092046, 1092047);
var status;
var sel1;
function start() {
    status = -1;
    action(1, 0, 0);
}
function action(mode, type, selection) {
    status++;
    if (mode != 1) {
        cm.dispose();
        return;
    }
    if (status == 0) {
        var text = "(如果你是花钱购买的，请立刻退款差评！)\r\n你好,打猎时候有收集到#r#z4001126##k吗?我正在收集它们,如果你给我枫叶,我可以奖励你的\r\n";
        text += "#L0#使用枫叶兑换35级枫叶武器#l\r\n";
        text += "#L1#使用枫叶兑换43级枫叶武器#l\r\n";
        text += "#L2#使用枫叶兑换64级枫叶武器#l\r\n";
        text += "#L3#使用枫叶和#z1092030#兑换64级枫叶盾#l\r\n";
        text += "#L4#使用枫叶抽奖#l\r\n";
        cm.sendSimple(text);
    } else if (status == 1) {
        sel1 = selection;
        var text;
        if (selection == 0) {
            text = "兑换35级枫叶武器需要#r5个#z4001126##k,看看你需要兑换什么吧\r\n";
            for (var i = 0; i < 武器35.length; i++) {
                text += "#L" + 武器35[i] + "##z" + 武器35[i] + "#\r\n";
            }
            cm.sendSimple(text);
        } else if (selection == 1) {
            text = "兑换43级枫叶武器需要#r7个#z4001126##k,看看你需要兑换什么吧\r\n";
            for (var i = 0; i < 武器43.length; i++) {
                text += "#L" + 武器43[i] + "##z" + 武器43[i] + "#\r\n";
            }
            cm.sendSimple(text);
        } else if (selection == 2) {
            text = "兑换64级枫叶武器需要#r9个#z4001126##k,看看你需要兑换什么吧\r\n";
            for (var i = 0; i < 武器64.length; i++) {
                text += "#L" + 武器64[i] + "##z" + 武器64[i] + "#\r\n";
            }
            cm.sendSimple(text);
        } else if (selection == 3) {
            text = "兑换64级枫叶盾需要#r9个#z4001126##k和一个#r#z1092030##k,看看你需要兑换什么吧\r\n";
            for (var i = 0; i < 职业盾.length; i++) {
                text += "#L" + 职业盾[i] + "##z" + 职业盾[i] + "#\r\n";
            }
            cm.sendSimple(text);
        } else {
            text = "要用#z4001126#抽奖吗?需要花费#r1个#z4001126##k,可能会获得这些奖励:\r\n";
            for (var i = 0; i < 抽奖.length; i++) {
                text += "#i" + 抽奖[i] + "#";
            }
            text += "抽不中还有金币奖励哦,确定要参与抽奖吗?";
            cm.sendYesNo(text);
        }
    } else if (status == 2) {
        var fee;
        if (sel1 == 0)
            fee = 5;
        else if (sel1 == 1)
            fee = 7;
        else if (sel1 == 2)
            fee = 9;
        else if (sel1 == 3)
            fee = 9;
        else
            fee = 1; //枫叶抽奖消耗枫叶数目
        if (cm.haveItem(4001126, fee)) {
            if (sel1 < 3) {
                if (cm.canHold(selection)) {
                    var item = cm.gainItem(selection, 1, true, false);
                    cm.gainItem(4001126, -fee);
					
                    cm.sendOk("#z" + selection + "#已经发送到您的背包,请注意查收");
                    //cm.getPlayer().broadcastMessage(cm.getPlayer().getName() + " : 恭喜玩家用枫叶成功兑换了", false, item);
                    cm.dispose();
                } else {
                    cm.sendOk("背包空间不足,兑换失败");
                    cm.dispose();
                }
            } else if (sel1 == 3) {
                if (cm.haveItem(1092030)) {
                    if (cm.canHold(selection)) {
                        var item = cm.gainItem(selection, 1, true, false);
                        cm.gainItem(4001126, -fee);
                        cm.gainItem(1092030, -1);
                        cm.sendOk("#z" + selection + "#已经发送到您的背包,请注意查收");
                        //cm.getPlayer().broadcastMessage(cm.getPlayer().getName() + " : 恭喜玩家用枫叶成功兑换了", false, item);
                        cm.dispose();
                    } else {
                        cm.sendOk("背包空间不足,兑换失败");
                        cm.dispose();
                    }
                } else {
                    cm.sendOk("你背包没有#z1092030#,无法完成兑换");
                    cm.dispose();
                }
            } else {
                if (cm.haveItem(4001126, fee)) {
                    var random = Math.floor(Math.random() * 抽奖.length * 2);
                    if (random < 抽奖.length) {
                        if (cm.canHold(抽奖[random])) {
                            var item = cm.gainItem(抽奖[random], 1, true, false);
                            cm.gainItem(4001126, -fee);
                            cm.sendOk("恭喜,这次抽中了#i" + 抽奖[random] + "#");
                            //cm.getPlayer().broadcastMessage(cm.getPlayer().getName() + " : 枫叶抽奖获得了", false, item);
                            status = -1;
                        } else {
                            cm.sendOk("背包空间不足,兑换失败");
                            cm.dispose();
                        }
                    } else {
                        cm.gainItem(4001126, -fee);
                        var meso = Math.floor(Math.random() * 10000);
                        cm.gainMeso(meso);
                        cm.sendOk("抱歉,这次什么也没抽到," + meso + "金币作为补偿");
                        status = -1;
                    }
                } else {
                    cm.sendOk("你没有足够的枫叶进行抽奖");
                    cm.dispose();
                }
            }
        } else {
            cm.sendOk("你没有足够的枫叶,在冒险岛里任何怪物都有可能掉落哟");
            cm.dispose();
        }
    }
}