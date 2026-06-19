function enter(pi) {
    var eim = pi.getEventInstance();
    if (eim != null) {
        if (eim.getIntProperty("glpq2") == 5 || eim.getPlayers().size() > 4) {  
            pi.playPortalSound();
            pi.warp(610030300, 0);
            return true;
        } else if  (eim.getIntProperty("glpq2") >= 1 && eim.getPlayers().size() < 5){  // 检测到队伍人数不足时，激活一个机关即可通过本关，方便单机玩家
            pi.playPortalSound();
            pi.warp(610030300, 0);
            return true;
        } else {
            pi.playerMessage(5, "传送门尚未激活！");
            return false;
        }
    }

    return false;
}