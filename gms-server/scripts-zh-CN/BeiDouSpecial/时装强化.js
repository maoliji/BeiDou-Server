var 红星星 = "#fUI/GuildMark.img/Mark/Pattern/00004001/1#";
var 黄星星 = "#fUI/GuildMark.img/Mark/Pattern/00004001/3#";
var status = 0;
var Item, ItemId, ItemName, 星星等级, 星星等级判定, 提示星星等级;

// 导入Java类
var ItemInformationProvider = Java.type('org.gms.server.ItemInformationProvider');
var WeaponType = Java.type('org.gms.client.inventory.WeaponType');  //武器判断
var Server = Java.type('org.gms.net.server.Server');
var PacketCreator = Java.type('org.gms.util.PacketCreator');

// 物品代码
var 强化材料 = 4001126;

// 每级的成功概率
var 星星升级概率成功1 = [100, 90, 90, 80, 80, 70, 70, 60, 60, 60, 50, 50, 50, 40, 40, 40, 30, 30, 30, 20, 20, 20, 10, 10, 10, 5, 5, 2, 2, 1];
// 每级升星上升的属性
var 星星升级提高属性1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 6];
// 每级升星所需要的物品数量
var 强化材料需求数量 = [1, 10, 100, 100, 100, 200, 200, 200, 200, 200, 300, 300, 300, 300, 300, 400, 400, 400, 400, 400, 500, 500, 500, 500, 500, 500, 500, 500, 500, 500];

var 星星升级概率最高 = 100;

var 文本名字;
var 星星等级判定;
var itemList, inventoryType;
var nrwb;
var nrpd = true;
var 设定成功率;
var 提高属性;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (status >= 0 && mode == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1)
            status++;
        else
            status--;
        if (status == 0) {
            // 检查第1格是否有可强化的时装或武器
            var equipInventory = cm.getInventory(1);
            var targetItem = equipInventory.getItem(1);
            
            if (targetItem == null) {
                cm.sendOk("#b请将需要强化的时装或武器放置在装备栏的#r第1格#b！");
                cm.dispose();
                return;
            }

            // 检查是否为现金物品或武器
            var ItemID = targetItem.getItemId();
            var ii = ItemInformationProvider.getInstance();
            var isCash = ii.isCash(ItemID);
            var isWeapon = (ii.getWeaponType(ItemID) != WeaponType.NOT_A_WEAPON);

            if (!isCash && !isWeapon) {
                cm.sendOk("请保证装备栏第一格的装备为时装或武器。");
                cm.dispose();
                return;
            }
            
            // 检查是否达到最大星星等级
            var owner = targetItem.getOwner();
            if (owner.indexOf("★x30") != -1) {
                cm.sendOk("这个装备已经强化星星到最大值了，无法进行强化！");
                cm.dispose();
                return;
            }
            
            // 检查装备是否有时间限制
            //if (targetItem.getExpiration() > 0) {
            //    cm.sendOk("#b这件时装装备有时限，无法进行强化。");
            //    cm.dispose();
            //    return;
            //}
            
            // 检查是否为不支持强化的类型（坐骑、披风等）
            var itemIdStr = String(ItemID);
            if ((itemIdStr.startsWith("190") || itemIdStr.startsWith("191") || itemIdStr.startsWith("110")) && itemIdStr.length == 7) {
                cm.sendOk("#b时装坐骑和时装披风暂时不支持强化。");
                cm.dispose();
                return;
            }
            
            // 准备强化第1格时装
            var text = "";
            text += "" + 红星星 + " #b欢迎来到 #r星星强化 #b功能 " + 红星星 + "\r\n\r\n";
            text += "" + 黄星星 + "#k将为您强化第1格的时装或武器装备" + 黄星星 + "\r\n\r\n";
            
            // 确定当前星星等级（从大到小遍历避免 "★x1" 误匹配 "★x10"）
            星星等级判定 = 0;
            for (var i = 30; i >= 1; i--) {
                if (owner.indexOf("★x" + i) != -1) {
                    星星等级判定 = i;
                    break;
                }
            }
            
            提高属性 = 星星升级提高属性1[星星等级判定];
            设定成功率 = 星星升级概率成功1[星星等级判定];
            
            text += "您当前选择的装备是[#r#v" + ItemID + "##z" + ItemID + "##k]\r\n";
            text += "星星强化之后以下属性会提高\r\n";
            text += "目前星星等级为:" + 黄星星 + "×" + 星星等级判定 + "#k\r\n";
            text += "本次升级的成功率为:#r" + 设定成功率 + "%#k\r\n";
            text += "所需材料为[#v" + 强化材料 + "##z" + 强化材料 + "#]×" + 强化材料需求数量[星星等级判定] + "\r\n";

            text += "力量:#r" + targetItem.getStr() + "#k + #r" + 提高属性 + "#k\r\n";
            text += "敏捷:#r" + targetItem.getDex() + "#k + #r" + 提高属性 + "#k\r\n";
            text += "智力:#r" + targetItem.getInt() + "#k + #r" + 提高属性 + "#k\r\n";
            text += "运气:#r" + targetItem.getLuk() + "#k + #r" + 提高属性 + "#k\r\n";
            text += "物攻:#r" + targetItem.getWatk() + "#k + #r" + 提高属性 + "#k\r\n";
            text += "魔攻:#r" + targetItem.getMatk() + "#k + #r" + 提高属性 + "#k\r\n";

            if (cm.getPlayer().getItemQuantity(强化材料, false) >= 强化材料需求数量[星星等级判定]) {
                text += "您是否准备好了要进行星星强化了呢";
                cm.sendYesNo(text);
            } else {
                text += "您的背包里面#v" + 强化材料 + "##z" + 强化材料 + "#不够 " + 强化材料需求数量[星星等级判定];
                cm.sendOk(text);
                cm.dispose();
                return;
            }

        } else if (status == 1) {
            // 执行强化逻辑
            cm.gainItem(强化材料, -强化材料需求数量[星星等级判定]);

            var 潜能概率成功 = Math.floor(Math.random() * 星星升级概率最高);
            if (潜能概率成功 > 设定成功率) {
                cm.sendOk("很可惜失败了,下次继续！别伤心，返还你一半强化材料吧~");
                cm.gainItem(强化材料, 强化材料需求数量[星星等级判定]/2);    
                cm.dispose();
                return;
            }

            // 获取原装备并直接修改（不使用 copy+remove+add 的方式，避免客户端状态不一致）
            var equipInventory = cm.getInventory(1);
            var targetItem = equipInventory.getItem(1);
            var slot = targetItem.getPosition();

            // 更新装备属性
            targetItem.setStr(targetItem.getStr() + 提高属性);
            targetItem.setDex(targetItem.getDex() + 提高属性);
            targetItem.setInt(targetItem.getInt() + 提高属性);
            targetItem.setLuk(targetItem.getLuk() + 提高属性);
            targetItem.setWatk(targetItem.getWatk() + 提高属性);
            targetItem.setMatk(targetItem.getMatk() + 提高属性);

            // 更新星星等级
            var owner = targetItem.getOwner();
            var newStarLevel = 星星等级判定 + 1;
            if (星星等级判定 == 0) {
                targetItem.setOwner(owner + "★x" + newStarLevel);
            } else {
                var oldStarStr = "★x" + 星星等级判定;
                var newStarStr = "★x" + newStarLevel;
                targetItem.setOwner(owner.replace(oldStarStr, newStarStr));
            }
            
            // 对强化后的装备进行上锁
            targetItem.setFlag(1); 

            // 使用 forceUpdateItem 在同一个数据包中完成删除+添加，避免客户端崩溃
            cm.getPlayer().forceUpdateItem(targetItem);

            // 获取物品名称
            var ii = ItemInformationProvider.getInstance();
            var itemName = ii.getName(targetItem.getItemId());
            var playerName = cm.getPlayer().getName();
            var world = cm.getPlayer().getWorld();

            // 广播强化结果
            if (newStarLevel < 10) {
                cm.mapMessage(5, "【星星强化】恭喜玩家 [" + playerName + "] 对装备【" + itemName + "】进行了星星强化,星级达到了" + newStarLevel + "星！");
            } else if (newStarLevel < 15) {
                cm.mapMessage(0, "【星星强化】恭喜玩家 [" + playerName + "] 对装备【" + itemName + "】进行了星星强化,星级达到了" + newStarLevel + "星！");
            } else if (newStarLevel < 30) {
                var broadcastMsg = "【星星强化】：恭喜玩家 [" + playerName + "] 对装备【" + itemName + "】进行了星星强化,星级达到了" + newStarLevel + "星！";
                cm.getPlayer().getWorldServer().dropMessage(6, broadcastMsg);
            } else {
                var broadcastMsg = "【星星强化】：恭喜玩家 [" + playerName + "] 对装备【" + itemName + "】进行了星星强化,星级达到了" + newStarLevel + "星！";
                cm.getPlayer().getWorldServer().dropMessage(6, broadcastMsg);
            }

            cm.sendOk("【星星强化】，装备属性提高了!");
            cm.dispose();
            return;
        }
    }
}
