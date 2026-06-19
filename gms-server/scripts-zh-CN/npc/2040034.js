/**
 * @author: Eric
 * @author: Ronan
 * @npc: Red Sign
 * @map: 101st Floor Eos Tower (221024500)
 * @func: Ludi PQ
 */

var status = 0;
var em = null;

function start() {
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
            em = cm.getEventManager("LudiPQ");
            if (em == null) {
                cm.sendOk("时空裂缝组队副本遇到了一个错误。");
                cm.dispose();
                return;
            } else if (cm.isUsingOldPqNpcStyle()) {
                action(1, 0, 0);
                return;
            }

            cm.sendSimple("#e#b<组队任务：时空裂缝>\r\n#k#n" + em.getProperty("party") + "\r\n\r\n由于上方有极其危险的生物，你无法再往上走。你想要和队友合作完成任务吗？如果是，请让你的#b队长#k和我交谈。#b\r\n#L0#我想参加组队任务。\r\n#L1#我想" + (cm.getPlayer().isRecvPartySearchInviteEnabled() ? "禁用" : "启用") + "组队搜索。\r\n#L2#我想了解更多详情。\r\n#L3#我想要兑换奖品。");
        } else if (status == 1) {
            if (selection == 0) {
                if (cm.getParty() == null) {
                    cm.sendOk("只有当你加入一个队伍时，你才能参加组队任务。");
                    cm.dispose();
                } else if (!cm.isLeader()) {
                    cm.sendOk("你的队长必须与我交谈才能开始这个组队任务。");
                    cm.dispose();
                } else {
                    var eli = em.getEligibleParty(cm.getParty());
                    if (eli.size() > 0) {
                        if (!em.startInstance(cm.getParty(), cm.getPlayer().getMap(), 1)) {
                            cm.sendOk("另一个队伍已经进入了该频道的#r组队任务#k。请尝试其他频道，或者等待当前队伍完成。");
                        }
                    } else {
                        cm.sendOk("你目前无法开始这个组队任务，因为你的队伍可能不符合人数要求，有些队员可能不符合尝试条件，或者他们不在这张地图上。如果你找不到队员，可以尝试使用组队搜索功能。");
                    }

                    cm.dispose();
                }
            } else if (selection == 1) {
                var psState = cm.getPlayer().toggleRecvPartySearchInvite();
                cm.sendOk("你的组队搜索状态现在是：#b" + (psState ? "开启" : "关闭") + "#k。想要改变状态时随时找我。");
                cm.dispose();
                        } else if (selection == 2)  {
                                cm.sendOk("#e#b<组队任务:时间裂隙>#k#n\r\n时间裂缝已经出现在#b#m220000000#!#k,我们需要勇敢的冒险家来打败入侵的怪物。拜托,请找几个可靠的队友帮我们拯救#e#m220000000#!你们需要进去挑战怪物,解开谜团,最终挑战#r#o9300012##k.");
                                cm.dispose();
                        }
                                else {
                                        cm.sendSimple("那么，你想得到什么奖品?\r\n#b#L0#给我#v1022073##z1022073#.\r\n");
                                }
                        } else if (status == 2) {
                                if (selection == 0) {
                                        if (cm.haveItem(4001246, 5) && cm.canHold(1022073)) {
                                                cm.gainItem(4001246, -5); //温暖的阳光
                                                cm.gainItem(1022073, 1);  //兑换划痕眼镜
              			cm.sendOk("兑换成功!");
                                                cm.dispose();
                                        } else {
                                                cm.sendOk("你没有5个#t4001246#.");
                                                cm.dispose();
                                        }
                                }
                        }
        }
}