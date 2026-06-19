/* Kedrick
	Fishking King NPC
*/

var status = -1;
var sel;

function start() {
    cm.sendYesNo("请问是否想钓鱼？（有BUG目前无法钓鱼）");
}


function action(mode, type, selection) {
    if (mode != 1) {
        if (mode == 0)
        cm.sendOk("好吧，以后再来~~"); //这句不能删，会卡住
        cm.dispose();
        return;
    }
    status++;
    if (status == 0) {
	cm.sendSimple("你想要做什么？（有BUG目前无法钓鱼）\n\r #b#L0#进入钓鱼场#l \n\r #L1#50万买鱼饵（有bug无法购买）#l \n\r #L2#500万买钓鱼椅#l \n\r #L3#用美味的饵兑换鱼饵（有bug无法购买）#l \n\r #L4#钓鱼指南#l \n\r #L5##i1142146:#（渔王勋章[期：30天]）#l");
    //cm.sendSimple("你好！我是渔场管理员.\n\r如果你想要进行钓鱼，请购买[钓鱼竿]，30秒钓一次鱼，产出各种好东东，好了介绍这么多，多多搜集兑换丰厚奖励吧！\n\r #b#L0# #v4000411#  进入钓鱼场.#l \n\r #L2##v3011000#  500万金币购买钓鱼椅.#l \n\r #b#L7##v5340000#  500万金币购买钓鱼杆.#l \n\r #b#L1##v5350000# 50w金币购买鱼饵.#l \n\r #L4##v4161001#   钓鱼指南.#l \n\r ");//#L5##v4001200# 小鱼抽奖处.
      } else if (status == 1) {
	sel = selection;
	if (sel == 0) {
//	    if (cm.haveItem(5340000) || cm.haveItem(5340001)) {
	    if (cm.haveItem(3011000)) {
		if (cm.haveItem(3011000)) {
	//	    cm.saveLocation("FISHING");
		    cm.getPlayer().saveLocation("MIRROR");//保存当前地图
		    cm.warp(741000200,0);
		    cm.dispose();
		} else {
		    cm.sendNext("你必须有鱼的椅子以便能钓鱼！");
		    cm.dispose();
		}
	    } else {
		cm.sendNext("你必须有鱼杆，有钓鱼椅！");
		cm.dispose();
	    }
	} else if (sel == 1) {
	    cm.sendYesNo("50万购买鱼饵。你想买吗？（有bug无法购买）");
	} else if (sel == 2) {
	    if (cm.haveItem(3011000)) {
		cm.sendNext("你已经有一把钓鱼椅。每个角色只能有1个钓鱼椅。");
	    } else {
		if (cm.canHold(3011000) && cm.getMeso() >= 5000000) {
		    cm.gainMeso(-5000000);
		    cm.gainItem(3011000, 1);
		    cm.sendNext("快乐钓鱼~");
		} else {
		    cm.sendOk("请检查是否有所需的500W金币或足够的背包空间。");
		}
	    }
	    cm.dispose();
		} else if (sel == 7) {
	    if (cm.haveItem(5340000)) {
		cm.sendNext("你已经有一把钓鱼竿。每个角色只能有1个钓鱼杆。");
	    } else {
		if (cm.canHold(5340000) && cm.getMeso() >= 5000000) {
		    cm.gainMeso(-5000000);
		    cm.gainItem(5340000, 1);
		    cm.sendNext("快乐钓鱼~");
		} else {
		    cm.sendOk("请检查是否有所需的500W金币或足够的背包空间。");
		}
	    }
	    cm.dispose();
		} else if (sel == 8) {
	    if (cm.haveItem(5340001)) {
		cm.sendNext("你已经有一把高级钓鱼椅。每个角色只能有1个高级钓鱼杆。");
	    } else {
		if (cm.canHold(5340001) && cm.getMeso() >= 100000000) {
		    cm.gainMeso(-100000000);
		    cm.gainItem(5340001, 1);
		    cm.sendNext("快乐钓鱼~");
		} else {
		    cm.sendOk("请检查是否有所需的1000W金币或足够的背包空间。");
		}
	    }
	    cm.dispose();
	} else if (sel == 3) {
	    //if (cm.canHold(2300001,120) && cm.haveItem(5350000,1)) {  //脚本中如果出现了不存在的物品，再用gm指令生成该物品，容易服务端卡死
		//if (!cm.haveItem(2300001)) {
		//    cm.gainItem(2300001, 120); // 鱼饵道具有bug无法获得
		//    cm.gainItem(5350000,-1);
		//    cm.sendNext("兑换钓鱼的诱饵成功~");
		      cm.sendNext("鱼饵道具有bug无法获得。");
		//} else {
		//    cm.sendNext("你已经有了钓鱼的诱饵。");
		//}
	//    } else {
	//	cm.sendOk("美味的诱饵可以去商场看看，另外请检查是否有足够的背包空间。");
	//    }
	    cm.dispose();
	} else if (sel == 4) {
	    cm.sendOk("你需要10级以上，有鱼竿、鱼饵，钓椅进入钓鱼湖。能出各种武器必成卷，正向卷，放大镜，游戏币等重要道具！");
	    cm.dispose();
	} else if (sel == 5) {
		//	cm.openNpc(9330045, 3);
		cm.sendOk("很抱歉因为bug无法获得该奖励。");
       		 cm.dispose();
      		  return;
        } else if (sel == 6) {
		//	cm.openNpc(9330045, 1);
		cm.sendOk("很抱歉因为bug无法获得该奖励。");
       		 cm.dispose();
      		  return;
	   // cm.dispose();
	}
    } else if (status == 2) {
	if (sel == 1) {
	    //if (cm.canHold(2300000,120) && cm.getMeso() >= 500000) {
		//if (!cm.haveItem(2300001)) {
		//    cm.gainMeso(-500000);
		//    cm.gainItem(2300000, 120);
		//    cm.sendNext("快乐钓鱼~");
		       cm.sendNext("有bug无法购买。");
		//} else {
		//    cm.sendNext("你已经有了钓鱼的诱饵。");
		//}
	   // } else {
	//	cm.sendOk("请检查是否有所需的500000金币或足够的背包空间。");
	 //   }
	    cm.dispose();
	}
    }
}