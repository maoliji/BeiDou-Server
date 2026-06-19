/*
    狮子王 班·雷昂 远征队事件
    适配：北斗GMS083 服务端
    参考：ZakumBattle.js 扎昆远征事件原生逻辑
*/

var isPq = true;
var minPlayers = 3, maxPlayers = 30;
var minLevel = 175, maxLevel = 200;
var entryMap = 211070100;    // 狮子王战斗地图
var exitMap = 211060800;     // 退出后返回地图
var recruitMap = 211070000;  // 远征队招募地图（NPC所在）
var clearMap = exitMap;      // 通关后返回地图

var minMapId = 211070100;
var maxMapId = 211070200;
var eventTime = 90;          // 挑战时间：90分钟
const maxLobbies = 1;        // 单频道仅允许1支远征队

const GameConfig = Java.type('org.gms.config.GameConfig');
// 适配服务端全局配置
minPlayers = GameConfig.getServerBoolean("use_enable_solo_expeditions") ? 1 : minPlayers;
if (GameConfig.getServerBoolean("use_enable_party_level_limit_lift")) {
    minLevel = 175;
    maxLevel = 200;
}

function init() {
    setEventRequirements();
}

function getMaxLobbies() {
    return maxLobbies;
}

function setEventRequirements() {
    var reqStr = "";
    reqStr += "\r\n   队伍人数: ";
    if (maxPlayers - minPlayers >= 1) {
        reqStr += minPlayers + " ~ " + maxPlayers;
    } else {
        reqStr += minPlayers;
    }
    reqStr += "\r\n   等级要求: ";
    if (maxLevel - minLevel >= 1) {
        reqStr += minLevel + " ~ " + maxLevel;
    } else {
        reqStr += minLevel;
    }
    reqStr += "\r\n   时间限制: ";
    reqStr += eventTime + " 分钟";
    em.setProperty("party", reqStr);
}

function setEventExclusives(eim) {
    var itemSet = [];
    eim.setExclusiveItems(itemSet);
}

function setEventRewards(eim) {
    var itemSet, itemQty, evLevel, expStages, mesoStages;
    evLevel = 1;
    
    // ========== 通关奖励配置（按需修改） ==========
    itemSet = [2000005, 4001190]; // 
    itemQty = [10, 1];
    // ============================================
    
    eim.setEventRewards(evLevel, itemSet, itemQty);
    
    expStages = [10000000]; // 通关经验奖励
    eim.setEventClearStageExp(expStages);
    
    mesoStages = [500000]; // 通关金币奖励
    eim.setEventClearStageMeso(mesoStages);
}

function afterSetup(eim) {
    // 狮子王无大门机制，无需更新状态
}

function setup(channel) {
    var eim = em.newInstance("VonLeon" + channel);
    eim.setProperty("canJoin", 1);
    eim.setProperty("defeatedBoss", 0);
    
    var level = 1;
    var battleMap = eim.getInstanceMap(entryMap);
    battleMap.resetPQ(level);
    battleMap.killAllMonsters();
    
    // 生成狮子王BOSS
    const LifeFactory = Java.type('org.gms.server.life.LifeFactory');
    var mob = LifeFactory.getMonster(8840000); // 狮子王本体ID
    battleMap.spawnMonsterOnGroundBelow(mob, new java.awt.Point(-170, -183));
    
    eim.startEventTimer(eventTime * 60000);
    setEventRewards(eim);
    setEventExclusives(eim);
    
    return eim;
}

function playerEntry(eim, player) {
    eim.dropMessage(5, "[远征队] " + player.getName() + " 已进入狮子王的接见室。");
    var map = eim.getMapInstance(entryMap);
    player.changeMap(map, map.getPortal(0));
}

function scheduledTimeout(eim) {
    eim.dropMessage(5, "[远征队] 挑战时间已到，离开战场！");
    end(eim);
}

function changedMap(eim, player, mapid) {
    if (mapid < minMapId || mapid > maxMapId) {
        partyPlayersCheck(eim, player);
    }
}

function changedLeader(eim, leader) {}

function playerDead(eim, player) {}

function playerRevive(eim, player) {
    //partyPlayersCheck(eim, player);  //狮子王远征的复活点设置为复活塔楼211070110，不会脱离远征战斗
}

function playerDisconnected(eim, player) {
    partyPlayersCheck(eim, player);
}

function leftParty(eim, player) {}

function disbandParty(eim) {}

function monsterValue(eim, mobId) {
    return 1;
}

function playerUnregistered(eim, player) {
    if (eim.isEventCleared()) {
        // 可选：通关后自动完成任务
        // em.completeQuest(player, 任务ID, 0);
    }
}

function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    player.changeMap(exitMap, 0);
}

function end(eim) {
    var party = eim.getPlayers();
    for (var i = 0; i < party.size(); i++) {
        playerExit(eim, party.get(i));
    }
    eim.dispose();
}

function giveRandomEventReward(eim, player) {
    eim.giveEventReward(player);
}

function clearPQ(eim) {
    eim.stopEventTimer();
    eim.setEventCleared();
    eim.setProperty("canJoin", 0); // 禁止后续玩家进入
    eim.dropMessage(5, "[远征队] 恭喜！你们成功击败了狮子王班雷昂！");
    eim.startEventTimer(900000); // 通关后15分钟强制清场，注意此时无法重连
}

function isVonLeon(mob) {
    return mob.getId() == 8840000;
}

function monsterKilled(mob, eim) {
    if (isVonLeon(mob) && eim.getIntProperty("defeatedBoss") == 0) {
        eim.setIntProperty("defeatedBoss", 1);
        eim.showClearEffect(mob.getMap().getId());
        clearPQ(eim);
    }
}

function allMonstersDead(eim) {}

function cancelSchedule() {}

function dispose(eim) {
    // 无大门机制，无需额外处理
}

function partyPlayersCheck(eim, player) {
    if (eim.isExpeditionTeamLackingNow(true, minPlayers, player)) {
        eim.unregisterPlayer(player);
        eim.dropMessage(5, "[远征队] 队伍人数不足最低要求，远征失败！");
        end(eim);
        return false;
    } else {
        eim.dropMessage(5, "[远征队] " + player.getName() + " 已离开副本。");
        eim.unregisterPlayer(player);
        return true;
    }
}