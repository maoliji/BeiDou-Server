/*
    This file is part of the HeavenMS MapleStory Server
    Copyleft (L) 2016 - 2019 RonanLana

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation version 3 as published by
    the Free Software Foundation. You may not use, modify or distribute
    this program under any other version of the GNU Affero General Public
    License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/* Dalair
	Medal NPC.

        NPC Equipment Merger:
        * @author RonanLana
        * 修复：任务狂人勋章任务领取功能 + 标准菜单格式
 */

var status;
var mergeFee = 50000000;  // 装备吸收的金币价格；
var name;
var selectedMenu;  // 存储选择的菜单项

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && type > 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }

        // 初始选择菜单 - 已修复为标准HeavenMS格式
        if (status == 0) {
            var selStr = "勋章排名系统当前不可用，但我提供以下服务：\r\n\r\n";
            selStr += "#b#L0#领取任务狂人勋章任务#l\r\n";
            selStr += "#L1#装备吸收属性提升服务#k#l";
            cm.sendSimple(selStr);
        }
        // 处理菜单选择
        else if (status == 1) {
            selectedMenu = selection;
            
            // 选择第一项：领取任务狂人勋章任务
            if (selectedMenu == 0) {
                var questId = 29001;
                var questStatus = cm.getQuestStatus(questId);
                var statusDesc = "";
                var message = "";
                
                switch (questStatus) {
                    case 0:  // 未接取
                        statusDesc = "未接取";
                        cm.startQuest(questId);
                        message = "#b【任务狂人勋章任务】#k\r\n\r\n当前进度：已成功接取！\r\n\r\n请按快捷键打开#b勋章#k列表查看进度。";
                        break;
                    case 1:  // 进行中
                        statusDesc = "进行中";
                        message = "#b【任务狂人勋章任务】#k\r\n\r\n当前进度：进行中\r\n\r\n请按快捷键打开#b勋章#k列表查看进度。";
                        break;
                    case 2:  // 已完成
                        statusDesc = "已完成";
                        message = "#b【任务狂人勋章任务】#k\r\n\r\n当前进度：已完成\r\n\r\n恭喜你获得任务狂人勋章！";
                        break;
                    default:
                        statusDesc = "状态异常（未知值：" + questStatus + "）";
                        message = "#b【任务狂人勋章任务】#k\r\n任务ID：" + questId + "\r\n当前进度：" + statusDesc;
                }
                
                cm.sendOk(message);
                cm.dispose();
            }
            // 选择第二项：装备吸收服务（原逻辑）
            else if (selectedMenu == 1) {
                const GameConfig = Java.type('org.gms.config.GameConfig');
                if (!GameConfig.getServerBoolean("use_enable_custom_npc_script")) {
                    cm.sendOk("勋章排名系统目前不可用。");
                    cm.dispose();
                    return;
                }

                var levelLimit = !cm.getPlayer().isCygnus() ? 180 : 120;  //这两个数字分别为其他职业和骑士团的等级要求，大于200级即为关闭，可根据需要修改等级要求以开放
                var selStr = "我提供#e#b装备吸收#k#n服务!\r\n";

                const MakerProcessor = Java.type('org.gms.client.processor.action.MakerProcessor');
                if (!GameConfig.getServerBoolean("use_starter_merge") && (cm.getPlayer().getLevel() < levelLimit || MakerProcessor.getMakerSkillLevel(cm.getPlayer()) < 3)) {
                    selStr += "然而, 你必须拥有#r3级锻造#k并且达到#r180级(骑士团120级)#k,支付#r" + cm.numberWithCommas(mergeFee) + "金币#k才可以使用这个服务.\r\n#e(此功能可以不限次数提升装备属性，影响较大，如需开放或关闭请修改脚本9000040.js)#n";
                    cm.sendOk(selStr);
                    cm.dispose();
                } else if (cm.getMeso() < mergeFee) {
                    selStr += "很抱歉，看起来你没有#r" + cm.numberWithCommas(mergeFee) + "金币#k, 导致你现在无法支付服务费... 请以后再来.";
                    cm.sendOk(selStr);
                    cm.dispose();
                } else {
                    selStr += "将你的背包中不需要的装备吸收到#b身上穿的装备#k中，以获得属性提升！服务费用是#r" + cm.numberWithCommas(mergeFee) + "#k金币。";
                    cm.sendNext(selStr);
                }
            }
        }
        // 装备吸收：输入装备名称
        else if (status == 2 && selectedMenu == 1) {
            selStr = "#r警告：#k请先在背包栏中准备好用来被吸收的装备素材，再输入第一个被吸收的装备名称。#b这件装备以及之后所有的装备道具都会被吸收消失掉，同名装备请千万注意排列好顺序，因错误操作损失自负！#k.\r\n\r\n请注意，吸收获得过属性提升的装备将#b无法进行交易#k，也不能当做合并素材。\r\n\r\n";
            cm.sendGetText(selStr);
        }
        // 装备吸收：处理装备名称并执行吸收
        else if (status == 3 && selectedMenu == 1) {
            name = cm.getText();

            if (cm.getPlayer().mergeAllItemsFromName(name)) {
                cm.gainMeso(-mergeFee);
                cm.sendOk("装备吸收完成！感谢您使用本服务，祝您享受新的装备属性。");
            } else {
                cm.sendOk("你的#b装备#k栏中没有#b'" + name + "'#k！");
            }

            cm.dispose();
        }
    }
}
