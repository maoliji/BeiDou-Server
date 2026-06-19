/**
 * @description 获取各种物品, 比如任务道具, 怪物掉落, 点装等
 * @author hzh
 */
 
var DataProviderFactory = Java.type('org.gms.provider.DataProviderFactory');
var WZFiles = Java.type('org.gms.provider.wz.WZFiles');
var ItemInformationProvider = Java.type('org.gms.server.ItemInformationProvider');
var StringBuilder = Java.type('java.lang.StringBuilder');
var Pair = Java.type('org.gms.util.Pair');
var I18nUtil = Java.type('org.gms.util.I18nUtil');
var dataProvider = DataProviderFactory.getDataProvider(WZFiles.STRING);
var iip = ItemInformationProvider.getInstance();
var text;
var sb;
var inputText;

function start() {
	text = "请输入物品名称:";
	cm.getInputTextLevel("SearchItem", text);
}

function levelSearchItem() {
	inputText = (inputText == null ? cm.getText() : inputText);
	if (inputText.trim() == "") {
		inputText = null;
		cm.getInputTextLevel("SearchItem", text);
		return;
	}
	sb = new StringBuilder(4096);
	sb.append("#e选择的物品将生成在脚下.#n\r\n\r\n#n");
	sb.append("#e#r#L0#返回#l#n\r\n\r\n");

	var allItems = iip.getAllItems();
	var zero = true;
	allItems.forEach(function(item) {
		var itemId = item.getLeft();
		var itemName = item.getRight().toLowerCase();
		if (sb.length() < 32654) {
			if (itemName.includes(inputText.toLowerCase())) {
				//sb.append("#L").append(itemId).append("##b").append(itemId).append("#k - #r").append(itemName).append("\r\n");
				sb.append("#L").append(itemId).append("##b").append(itemId).append("#k - #r#z").append(itemId).append("#\r\n"); //改成鼠标指上去显示物品属性
				zero = false;
			}
		} else {
			sb.append("#b").append(I18nUtil.getMessage("SearchCommand.message5")).append("\r\n");
			return;
		}
	});
	if (zero) {
		inputText = null;
		cm.getInputTextLevel("SearchItem", "#r未检测到物品, 请重新输入物品名称:");
	} else
		cm.sendNextSelectLevel("Perform", sb.toString());
}

function levelPerform(selection) {
	if (selection == 0){
		inputText = null;
		start();
		return;
	}
	// 必须是丢出 , 不能直接生成到背包, 假如物品有问题, 到背包后游戏会直接崩溃, 这类有问题的物品无法丢出/拾取.
	var p = cm.getPlayer();
	var item = iip.getEquipById(selection);
	p.getMap().spawnItemDrop(p, p, item, p.getPosition(), false, false);
	cm.dispose(); // 结束对话，避免卡NPC

	/** 备用代码: 根据物品ID生成物品到背包
	var itemType = iip.getEquipById(selection).getInventoryType();
	if (cm.getPlayer().getInventory(itemType).isFull()) {
		cm.dropMessage(1, itemType.getName() + "栏已满, 请腾出位置后再尝试!~");
	} else {
		cm.dropMessage(0, iip.getItemData(selection) + "");
		cm.gainItem(selection,1);
		cm.dispose(); // 结束对话，避免卡NPC
	}
	*/
}