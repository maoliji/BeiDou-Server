function start() {
    if(cm.getMapId() == 501030105) {
         cm.sendYesNo("你想要离开这里吗?");  }
        else if(cm.getMapId() == 501030104)  {cm.sendYesNo("你想要挑战六手邪神? 这需要消耗你一个#r#t4031722##k。");
    } else {
        cm.sendOk("在黄金寺庙最深处有六手邪神的存在...");
    }
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose(); }

    else if (selection && cm.getMapId() == 501030104){
	if(!cm.haveItem(4031722)) {
	cm.sendOk("你没有#r#t4031722##k，去完成前置任务来获得吧。");
	cm.dispose();
	} else {
        cm.gainItem(4031722,-1);
        cm.warp(501030105);
        cm.dispose();
	}
    }
    else if (selection && cm.getMapId() == 501030105){
        cm.warp(501030104);
        cm.dispose();
    }
    else
        cm.dispose();

}