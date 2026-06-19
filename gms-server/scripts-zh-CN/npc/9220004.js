/**
 Happy - Happy ville
 @author Ronan
 **/
var status = -1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (status == 0 && mode == 0) {
            cm.sendOk("当你想要的时候再和我说话。");
            cm.dispose();
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        if (status == 0) {
            cm.sendSimple("#b<突袭任务：幸福村>#k\r\n突袭就是许多人联合起来试图击败极其强大的生物。这里也不例外。每个人都可以参与击败出现的生物。你会做什么？\r\n#b\r\n#L0#召唤雪人孩子。\r\n#L1#召唤迷失的鲁道夫。\r\n#L2#获取雪球。\r\n#L3#什么都不做，只是放松一下。#k");
        } else if (status == 1) {
            if (selection == 0) {
                if (cm.getMap().countMonster(9500317) >0 || cm.getMap().countMonster(9500318) >0 || cm.getMap().countMonster(9500319) >0 || cm.getMap().getMonsters().size() > 2) {  //reactor as a monster? wtf
                    cm.sendOk("清除该区域所有的怪物，再召唤雪人宝宝。");
                    cm.dispose();
                    return;
                }
                    cm.getMap().spawnMonsterOnGroundBelow(9500317, 1700, 80);
                    cm.dispose();

            } else if (selection == 1) {
                if (cm.getMap().countMonster(9500320) >0 || cm.getMap().getMonsters().size() > 2) {  //reactor as a monster? wtf
                    cm.sendOk("这个地方现在太拥挤了。先清理一些怪物然后再次尝试。");
                    cm.dispose();
                    return;
                }
                    cm.getMap().spawnMonsterOnGroundBelow(9500320, 1700, 80);
                    cm.dispose();
            } else if (selection == 2) {
                    cm.sendOk("给了你一些#v2060005#和#v2060006#。");
                    cm.gainItem(2060005, 100);
                    cm.gainItem(2060006, 100);
                    cm.dispose();

            } else {
                cm.sendOk("好的。");
            }

            cm.dispose();
        }
    }
} 