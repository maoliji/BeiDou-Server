/**
 * @author: Ronan
 * @npc: Ellin
 * @map: Ellin PQ
 * @func: Ellin PQ Coordinator
 */

var status = 0;
var mapid;

function start() {
    mapid = cm.getPlayer().getMapId();

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
            var ellinStr = ellinMapMessage(mapid);

            if (mapid == 930000000) {
                cm.sendNext(ellinStr);
            } else if (mapid == 930000300) {
                var eim = cm.getEventInstance();

                if (eim.getIntProperty("statusStg4") == 0) {
                    eim.showClearEffect(cm.getMap().getId());
                    eim.setIntProperty("statusStg4", 1);
                }

                cm.sendNext(ellinStr);
            } else if (mapid == 930000400) {
                if (cm.haveItem(4001169, 20)) {
                    if (cm.isEventLeader()) {
                        cm.sendNext("哦，你带来了#z4001169#！我们现在可以继续了，我们要继续吗？");
                    } else {
                        cm.sendOk("你已经带来了#z4001169#，但你不是队长！请让队长把毒珠给我……");
                        cm.dispose();

                    }
                } else {
                    if (cm.getEventInstance().gridCheck(cm.getPlayer()) != 1) {
                        cm.sendNext(ellinStr);

                        cm.getEventInstance().gridInsert(cm.getPlayer(), 1);
                        status = -1;
                    } else {
                        var mobs = cm.getMap().countMonsters();

                        if (mobs > 0) {
                            if (!cm.haveItem(2270004)) {
                                if (cm.canHold(2270004, 20)) {
                                    cm.gainItem(2270004, 20);
                                    cm.sendOk("请给我20个#t2270004#。首先，#r削弱#o9300174#的力量，一旦它的生命值降低，使用我给你的物品来捕捉它们。");
                                    cm.dispose();

                                } else {
                                    cm.sendOk("在接收净化器之前，请给消耗栏腾出一些空间！");
                                    cm.dispose();

                                }
                            } else {
                                cm.sendYesNo(ellinStr + "\r\n\r\n你想离开？请再三考虑，也许你的队友还在尝试这个任务.");
                            }
                        } else {
                            cm.sendYesNo("你们已经捕捉到了所有的 #o9300174#。让队长把所有的 #b20 #t4001169##k 给我，然后我们继续。" + "\r\n\r\n还是你想离开？请再三考虑，也许你的队友还在尝试这个任务。");
                        }
                    }
                }
            } else {
                cm.sendYesNo(ellinStr + "\r\n\r\n你想离开？请再三考虑，也许你的队友还在尝试这个任务.");
            }
        } else if (status == 1) {
            if (mapid == 930000000) {
            } else if (mapid == 930000300) {
                cm.getEventInstance().warpEventTeam(930000400);
            } else if (mapid == 930000400) {
                if (cm.haveItem(4001169, 20) && cm.isEventLeader()) {
                    cm.gainItem(4001169, -20);
                    cm.getEventInstance().warpEventTeam(930000500);
                } else {
                    cm.warp(930000800, 0);
                }
            } else {
                cm.warp(930000800, 0);
            }

            cm.dispose();
        }
    }
}

function ellinMapMessage(mapid) {
    switch (mapid) {
        case 930000000:
            return "欢迎来到毒雾森林。进入入口继续.";

        case 930000100:
            return "#b#o9300172##k 已经占领了这个地区。我们必须消灭所有这些被污染的怪物才能继续前.";

        case 930000200:
            return "一根大刺藤挡住了前面的路。为了消除这个障碍，我们必须找回#b#o9300173##k以阻止过度生长的脊柱。然而，天然状态下的毒药是不能处理的，因为它太浓了.我们需要再#b泉水#k那边稀释";

        case 930000300:
            return "太棒了,你们来到这里了.我们现在可以继续深入树林探索了.";

        case 930000400:
            return "#b#o9300175##k空这里这里.然而他们并不是普通的怪物,他们生长的很快,#r普通的攻击和魔法完全不法伤害他们#k.我们必须使用#b#t2270004##k净化这些被污染的怪物!让你的队长给我20个怪物毒珠.";

        case 930000600:
            return "这个森林问题的根源就在这里了! 把得到的#z4001163#放到祭坛上,保护好自己!";

        case 930000700:
            return "你们成功了!感谢你们净化了森林!!";

    }
}