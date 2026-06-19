function enter(pi) {
    var map = pi.getPlayer().getMap();
    var eim = pi.getEventInstance();
    if (pi.getPortal().getName() == "female00") {
        if (pi.getPlayer().getGender() == 1 && eim.getPlayers().size() > 1) { // 检测到两个或以上玩家时，传送门才限制性别
            pi.playPortalSound();
            pi.warp(map.getId(), "female01");
            return true;
        } else if (eim.getPlayers().size() == 1) {  // 检测到单人玩家时，传送门不限制性别
            pi.playPortalSound();
            pi.warp(map.getId(), "female01");
            return true;
        } else {
            pi.message("此传送门通向女生区域，请使用另一侧的男生传送门");
            return false;
        }
    } else {
        if (pi.getPlayer().getGender() == 0 && eim.getPlayers().size() > 1) { // 检测到两个或以上玩家时，传送门才限制性别
            pi.playPortalSound();
            pi.warp(map.getId(), "male01");
            return true;
        } else if (eim.getPlayers().size() == 1) {  // 检测到单人玩家时，传送门不限制性别
            pi.playPortalSound();
            pi.warp(map.getId(), "male01");
            return true;
        } else {
            pi.message("此传送门通向男生区域，请使用另一侧的女生传送门");
            return false;
        }
    }
}