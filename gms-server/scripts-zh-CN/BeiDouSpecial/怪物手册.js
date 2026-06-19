/**
 * @description 怪物手册, 查询怪物掉落以及出现的地图
 * @author hzh
 */
 
var ItemInformationProvider = Java.type('org.gms.server.ItemInformationProvider');
var MonsterInformationProvider = Java.type('org.gms.server.life.MonsterInformationProvider');
var StringBuilder = Java.type('java.lang.StringBuilder');
var DataProviderFactory = Java.type('org.gms.provider.DataProviderFactory');
var WZFiles = Java.type('org.gms.provider.wz.WZFiles');
var DataTool = Java.type('org.gms.provider.DataTool');
var KeyBinding = Java.type('org.gms.client.keybind.KeyBinding');
var LifeFactory = Java.type('org.gms.server.life.LifeFactory');
var dataProvider = DataProviderFactory.getDataProvider(WZFiles.STRING);
var iip = ItemInformationProvider.getInstance();
var mip = MonsterInformationProvider.getInstance();

var msgText;
var dropText;
var mapText;
var mobCardId;
var sb;
var inputText;
var equipDrop = [];
var useDrop = [];
var etcDrop = [];

function start() {
	text = "请输入怪物名称:";
	cm.getInputTextLevel("SearchMobData", text);
}

function levelSearchMobData() {
	inputText = (inputText == null ? cm.getText() : inputText);
	if (inputText.trim() == "") {
		inputText = null;
		cm.getInputTextLevel("SearchMobData", text);
		return;
	}
	if (sb == null)
		sb = new StringBuilder(4096);
	sb.append("#r请选择怪物以查看信息.#n\r\n\r\n#n");
	var zero = true;
	var mobData = dataProvider.getData("Mob.img");
	mobData.getChildren().forEach(function(mob) {
		var id = parseInt(mob.getName());
		var mobName = DataTool.getString(mob.getChildByPath("name"), "NO-NAME");
		if (mobName.includes(inputText.toLowerCase())) {
			zero = false;
			sb.append("#L").append(id).append("##b").append(id).append("#k - #r").append(mobName).append("\r\n");
		}
	});
	if (zero) {
		inputText = null;
		cm.getInputTextLevel("SearchMobData", "#r未检测到怪物, 请重新输入怪物名称:");
	} else
		cm.sendNextSelectLevel("Perform", sb.toString(), 2);
	sb = null;
}

function levelPerform(mobId) {
	var mob = LifeFactory.getMonster(mobId);
	if (mob == null) {
		sb = new StringBuilder(4096);
		sb.append("#r由于数据原因, 刚刚选择的怪物不存在.#n\r\n\r\n#n");
		levelSearchMobData();
		return;
	}
	// 怪物掉落数据
	dropText = "\r\n#e#d===战利品(点击可获取指定物品)===#k#n\r\n";
	var dropDatas = mip.retrieveDrop(mobId);
	dropDatas.forEach((d) => {
		var itemId = d.itemId;
		if (itemId <= 0) return;
		var it = iip.getEquipById(itemId).getInventoryType().name();
		if (it == "EQUIP")
			equipDrop.push(itemId);
		else if (it == "USE")
			useDrop.push(itemId);
		else if (it == "ETC")
			etcDrop.push(itemId);
	});
	printData(etcDrop, "#e其他物品#k#n", 6, false);
	printData(equipDrop, "#e装备物品#k#n", 6, false);
	printData(useDrop, "#e消耗物品#k#n", -1, false);
	// 怪物地图数据
	mapText = "\r\n#e#d===出没地区(点击可进行跳转)===#k#n\r\n";
	var mobBook = dataProvider.getData("MonsterBook.img");
	var mobData = mobBook.getChildByPath(String(mobId));
	if (mobData == null) {
		mapText += "\r\n\t\t#e#r无法获取怪物的出没地区#k#n\r\n";
	} else {
		mobData.getChildByPath("map").getChildren().forEach(function(map) {
			var mapId = map.getData();
			mapText += `#L${-mapId}##b${mapId}#k - #r#m${mapId}##l\r\n`;
		});
	}
	// 怪物基本数据
	var stats = mob.getStats();
	msgText = `${getMobImage(mob)} \t #eLv.#n${stats.getLevel()}\r\n`;
	msgText += `[ #e#d${mob.getName()}#n ${mob.isBoss() ? "#r#eBOSS怪物#n#k" : "#d普通怪物#n#k"} ]  #e#rHP：${mob.getMaxHp().toString()}  #e#bMP：${mob.getMaxMp()}\r\n#k#n`;
    msgText += `物攻：${stats.getPADamage().toString()}\t物防：${stats.getPDDamage()}\t`;
    msgText += `魔攻：${stats.getMADamage().toString()}\t魔防：${stats.getMDDamage()}\r\n`;
		
	equipDrop = [];
	useDrop = [];
	etcDrop = [];
	var end = "#e#r#L0#返回#l\r\n";
	cm.sendNextSelectLevel("Process", (msgText + mapText + dropText+ end), 2);
}

function levelProcess(id) {
	if (id == 0) {
		mobCardId = null;
		levelSearchMobData();
		return;
	}
	if(id < 0) {
		cm.getPlayer().changeMap(-id);
	} else {
		var p = cm.getPlayer();
		var item = iip.getEquipById(id);
		p.getMap().spawnItemDrop(p, p, item, p.getPosition(), false, false);
	}
	cm.dispose();
}


function printData(drop, desc, rn, printName) {
	if (drop.length > 0) {
		if (desc != null)
			dropText += `\r\n${desc}: \r\n`;
		if (rn == -1) {
			var useDropBooK = [];
			var useDropOther = [];
			for (var i = 0; i < drop.length; i++) {
				var itemName = iip.getName(drop[i]).toString();
				if (itemName.indexOf("卷轴") > 0 || itemName.indexOf("技能册") > 0 || itemName.indexOf("能手册") > 0)
					useDropBooK.push(drop[i]);
				else
					useDropOther.push(drop[i]);
				if (itemName.indexOf("卡片") > 0)
					mobCardId = drop[i];
			}
			printData(useDropOther, null, 6, false);
			printData(useDropBooK, null, 1, true);
		} else {
			for (var i = 0; i < drop.length; i++) {
				if (printName)
					dropText += `#L${drop[i]}##v${drop[i]}:# #d#z${drop[i]}##l`;
				else 
					dropText += `#L${drop[i]}##v${drop[i]}:##l`;
				if ((i + 1) % rn == 0)
					dropText += "\r\n";
			}
		}
		dropText += "\r\n";
	}
}
function getMobImage(mob){
	var def = `#fUI/UIWindow.img/Maker/randomRecipe#  (怪物缺少图片，无法展示)\r\n`;
	if (mobCardId != null)
		def = `#fItem/Consume/0238/0${mobCardId}/info/iconRaw#`;
	var type = [null,'stand','fly']
        type = type[mob.getStats().getMovetype() + 1];    //-1=未知类型，0=陆地类型，1=飞天类型
	if(type == null) 
		return def;
	// 检测怪物是否有图片, 解决客户端报错强退问题
	var mp = DataProviderFactory.getDataProvider(WZFiles.MOB);
	var mobImg = mp.getData(`${mob.getId().toString().padStart(7, '0')}.img`);
	if (mobImg == null)
		return def;
	if (mobImg.getChildByPath(type) == null)
		return def;
	if (mob.getStats().getImgwidth() > 160 && mob.getStats().getImgheight() > 250) { //如果图片超过指定范围会造成客户端假死，因此这里需要替换成别的图片或者干脆不要。
        if (mobCardId != null)
			return `#fItem/Consume/0238/0${mobCardId}/info/iconRaw#  (形象过大，无法展示)\r\n`;
		else 
			return `#fMob/1210102.img/stand/0#  (形象过大，无法展示)`;
    } else if (mob.getStats().getImgwidth() < 5 && mob.getStats().getImgheight() < 5) {
		return def;
	}else {
		cm.dropMessage(0, "111");
        //当前怪物ID最多7位数，不足7位数则需要在前面补0
        return `#fMob/${mob.getId().toString().padStart(7, '0')}.img/${type}/0#`;
    }
}
