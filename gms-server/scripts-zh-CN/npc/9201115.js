var status = -1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    var eim = cm.getEventInstance();
    if (eim != null && eim.getIntProperty("glpq6") == 3) {
        cm.sendOk("干得漂亮。你超越了扭曲大师。通过那扇门领取你的奖品吧。");
        cm.dispose();
        return;
    }

    if (!cm.isEventLeader()) {
        cm.sendNext("让队长来找我。");
        cm.dispose();
        return;
    }

    if (mode == 1) {
        status++;
    } else {
        status--;
    }

    if (eim != null) {
        if (eim.getIntProperty("glpq6") == 0) {
            if (status == 0) {
                cm.sendNext("欢迎来到扭曲大师的们的晚宴...");
            } else if (status == 1) {
                cm.sendNext("今晚，我们有一群冒险岛玩家的盛宴.. 哈哈哈...\r\n让我们训练有素的精英护卫来招待你！");
            } else if (status == 2) {
                //cm.sendNext("让我们经过特别训练的守护大师护送你！"); //召唤boss时弹出对话框有时会掉线
                cm.mapMessage(6, "注意！精英护卫们出现了!");
                for (var i = 0; i < 10; i++) {
                    var mob = eim.getMonster(9400594);
                    const xPos = Math.floor(-1337 + (Math.random() * 1337))
                    cm.getMap().spawnMonsterOnGroundBelow(mob, new java.awt.Point(xPos, 276));
                }
                for (var i = 0; i < 20; i++) {
                    var mob = eim.getMonster(9400582);
                    const xPos = Math.floor(-1337 + (Math.random() * 1337))
                    cm.getMap().spawnMonsterOnGroundBelow(mob, new java.awt.Point(xPos, 276));
                }
                eim.setIntProperty("glpq6", 1);
                cm.dispose();
            } else {                 
		cm.dispose();
          }	
        } else if (eim.getIntProperty("glpq6") == 1) {
            if (cm.getMap().countMonsters() == 0) {
                if (status == 0) {
                    cm.sendOk("嗯，什么？你打败了它们？\r\n好吧，没关系！扭曲大师们会很高兴欢迎你的。");
                } else if (status == 1) {
                    //cm.sendNext("好吧，无论如何！扭曲大师们会很高兴欢迎你。"); //召唤boss时弹出对话框有时会掉线
                    cm.mapMessage(6, "注意！扭曲大师们出现了!");

                    //Margana
                    var mob = eim.getMonster(9400590);
                    cm.getMap().spawnMonsterOnGroundBelow(mob, new java.awt.Point(-22, 1));

                    //Red Nirg
                    var mob2 = eim.getMonster(9400591);
                    cm.getMap().spawnMonsterOnGroundBelow(mob2, new java.awt.Point(-22, 276));

                    //Hsalf
                    var mob4 = eim.getMonster(9400593);
                    cm.getMap().spawnMonsterOnGroundBelow(mob4, new java.awt.Point(496, 276));

                    //Rellik
                    var mob3 = eim.getMonster(9400592);
                    cm.getMap().spawnMonsterOnGroundBelow(mob3, new java.awt.Point(-496, 276));

                    eim.setIntProperty("glpq6", 2);
                    cm.dispose();
                } else {                 
		cm.dispose();
          }	
            } else {
                cm.sendOk("不要把注意力放在我身上，精英护卫们会好好招待你们的！");
                cm.dispose();
            }
        } else if (eim.getIntProperty("glpq6") == 2) {
            if (cm.getMap().countMonsters() == 0) {
                cm.sendOk("什么？呃...这不可能。");
                cm.mapMessage(5, "通往下一阶段的门已经打开!");
                eim.setIntProperty("glpq6", 3);

                eim.showClearEffect(true);
                eim.giveEventPlayersStageReward(6);

                eim.clearPQ();
                cm.dispose();
            } else {
                cm.sendOk("不要把注意力放在我身上，扭曲大师们会好好招待你们的！");
                cm.dispose();
            }
        } else {
            cm.sendOk("干得漂亮。你超越了扭曲大师。通过那扇门领取你的奖品吧。");
            cm.dispose();
        }
    } else {
        cm.dispose();
    }
}