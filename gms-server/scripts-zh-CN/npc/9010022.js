var status;
var sel;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (status == 0) {
            if (cm.getLevel() < 20) {
                cm.sendDimensionalMirror("#-1# 现在没有你可以传送的位置.");
                cm.dispose();
            } else {
                var selStr = "";
                if (cm.getLevel() >= 20) {
                    selStr += "#0# 阿里安特挑战赛"; 
                }

                if (cm.getLevel() >= 25) { 
                    selStr += "#1# 武陵道场"; 
                } 

                if (cm.getLevel() >= 30) {   // MC 1 & 2 recalled thanks to ---
                    selStr += "#2# 怪物嘉年华1"; 
                } 

                if (cm.getLevel() >= 51) {
                    selStr += "#3# 怪物嘉年华2"; 
                } 

               // if (cm.getLevel() >= 55) { //暂无法返回原地图
               //     selStr += "#4# 老海盗"; 
              //  } 

                if (cm.getLevel() >= 40) { //未开放
                    selStr += "#5# Nett's Pyramid"; 
                } 

                if (cm.getLevel() >= 25) { //未开放
                    selStr += "#6# Construction Site"; 
                } 

//客户端默认只有6个图标，顺序固定，添加新传送需要客户端支持，且返回原地图也需要map传送点增加脚本

                cm.sendDimensionalMirror(selStr);
            }
        } else if (status == 1) {
            cm.getPlayer().saveLocation("MIRROR");
            switch (selection) {
                case 0:
                    cm.warp(980010000, 3);
                    break;
                case 1:
                    cm.warp(925020000, 0);
                    break;
                case 2:
                    cm.getPlayer().saveLocation("MONSTER_CARNIVAL");
                    cm.warp(980000000, 3);
                    break;
                case 3:
                    cm.getPlayer().saveLocation("MONSTER_CARNIVAL");
                    cm.warp(980030000, 3);
                    break;
                case 4:
                    cm.warp(251010404, 4);
                    break;
                case 5:
                    cm.warp(926010000, 4);
                    break;
                case 6:
                    cm.warp(910320000, 2);
                    break;
            }
            cm.dispose();
        }
    }
}  