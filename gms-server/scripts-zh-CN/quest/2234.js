var status = -1;

function start(mode, type, selection) {
	if (qm.getPlayer().getCurrentRep() > 0 && qm.getPlayer().getTotalRep() > qm.getPlayer().getCurrentRep()) {
		qm.forceCompleteQuest();
		qm.gainExp(3000);
		qm.sendNext("做得好!");
	} else {
		qm.sendNext("请让队长联系我!");
	}
	qm.dispose();
}
function end(mode, type, selection) {
	if (qm.getPlayer().getCurrentRep() > 0 && qm.getPlayer().getTotalRep() > qm.getPlayer().getCurrentRep()) {
		qm.forceCompleteQuest();
		qm.gainExp(3000);
		qm.sendNext("做得好!");
	} else {
		qm.sendNext("请让队长联系我!");
	}
	qm.dispose();
}