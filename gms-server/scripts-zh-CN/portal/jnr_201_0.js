function enter(pi) {
    var eim = pi.getEventInstance();
    if (pi.getMap().getReactorByName("jnr31_out").getState() == 1 || eim.getPlayers().size() < 2) {  // 检测到队伍人数不足时，门保持打开，方便单机玩家
        pi.playPortalSound();
        pi.warp(926110200, 1);
        return true;
    } else {
        pi.playerMessage(5, "传送门尚未开启。");
        return false;
    }
}