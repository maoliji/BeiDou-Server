/*
	NPC: Blocked Entrance (portal?)
	MAP: Mushroom Castle - East Castle Tower (106021400)
*/

var status;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
        return;
    } else if (mode == 0 && status == 0) {
        cm.dispose();
        return;
    } else if (mode == 0) {
        status--;
    } else {
        status++;
    }

    if (cm.getMapId() == 106021402) {
        if (!(cm.isQuestCompleted(2331)) && cm.getPlayer().getLevel()<=50 ) {
            cm.dispose();
            return;
        }

        if (status == 0) {
            cm.sendSimple("#L0#进入战斗 #b企鹅王#k 和 #b雪人兄弟#k。#l\r\n#L1#进入战斗 #b蘑菇大臣#k#r（请确认队伍符合要求）#k。#l");
        } else if (status == 1) {
            if (selection == 0) {
                var pepe = cm.getEventManager("KingPepeAndYetis");
                pepe.setProperty("player", cm.getPlayer().getName());
                pepe.startInstance(cm.getPlayer());
                cm.dispose();
            } else if (selection == 1) {
                // 核心修复：增加事件管理器校验+队伍准入校验+队长校验
                var em = cm.getEventManager("MK_PrimeMinister2");
                if (em == null) {
                    cm.sendOk("蘑菇大臣BOSS事件未配置，请联系管理员！");
                    cm.dispose();
                    return;
                }

                var player = cm.getPlayer();
                var party = player.getParty();
                var startSuccess = false;

                if (party != null) {
                    // 新增：判断当前玩家是否是队长
                    if (party.getLeaderId() != player.getId()) {
                        cm.sendOk("请让队长来操作！");
                        cm.dispose();
                        return;
                    }
                    
                    // 先获取符合条件的队伍成员
                    var eligibleParty = em.getEligibleParty(party);
                    if (eligibleParty.length === 0) {
                        cm.sendOk("队伍不符合挑战条件！\r\n" + em.getProperty("party"));
                        cm.dispose();
                        return;
                    }
                    // 调用组队模式的startInstance
                    startSuccess = em.startInstance(party, cm.getMap(), 1);
                } else {
                    // 单人模式
                    startSuccess = em.startInstance(player);
                }

                if (!startSuccess) {
                    cm.sendOk("另一个队伍已经在这个频道挑战boss了。");
                }
                cm.dispose();
            }
        }
    } else {
        var questProgress = cm.getQuestProgressInt(2330, 3300005) + cm.getQuestProgressInt(2330, 3300006) + cm.getQuestProgressInt(2330, 3300007);
        if (!(cm.isQuestStarted(2330) && questProgress < 3)) {
            cm.dispose();
            return;
        }

        if (status == 0) {
            cm.sendSimple("#L1#进入挑战 #b企鹅王#k 和 #b雪人兄弟#k。#l");
        } else if (status == 1) {
            if (selection == 1) {
                var pepe = cm.getEventManager("KingPepeAndYetis");
                pepe.setProperty("player", cm.getPlayer().getName());
                pepe.startInstance(cm.getPlayer());
                cm.dispose();
            }
        }
    }
}