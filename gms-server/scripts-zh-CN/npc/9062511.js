var status = -1;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    } else {
        status--;
    }

    if (status == 0) {
        cm.sendYesNo("#b[稻草人伤害测试]#k\r\n限时 1 分钟，记录你的总伤害与秒伤害。\r\n是否进入？");
    } else if (status == 1) {
        var em = cm.getEventManager("StrawManChallenge");
        if (em == null) {
            cm.sendOk("活动未开放，请联系管理员。");
            cm.dispose();
            return;
        }
        // 创建单人副本实例（参数任意，setup 会忽略）
        em.newInstance("single");
        cm.dispose();
    }
}