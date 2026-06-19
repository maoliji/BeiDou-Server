function enter(pi) {
    var eim = pi.getEventInstance();
    if (eim != null) {
        if (eim.getIntProperty("glpq3") < 5 || eim.getIntProperty("glpq3_p") < 5) {
        if (eim.getPlayers().size() < 5 && eim.getIntProperty("glpq3") > 0 && eim.getIntProperty("glpq3_p") > 0){  // 检测到队伍人数不足时，激活一个机关即可通过本关，方便单机玩家
            pi.playPortalSound();
            pi.warp(610030400, 0);
            return true;
        } else {
            pi.playerMessage(5, "传送门尚未开启。");
            return false;
    }
        } else {
            pi.playPortalSound();
            pi.warp(610030400, 0);
            return true;
        }
    }

    return false;
}