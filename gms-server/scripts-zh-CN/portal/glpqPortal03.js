function enter(pi) {
    var eim = pi.getEventInstance();
    if (pi.getPlayer().getJob().getJobNiche() == 4 || eim.getPlayers().size() < 5){  // 检测到队伍人数不足时，不限制进门的职业，方便单机玩家
        pi.playPortalSound();
        pi.warp(610030530, 0);
        return true;
    } else {
        pi.playerMessage(5, "※ 仅限飞侠职业进入该传送门！");
        return false;
    }
}