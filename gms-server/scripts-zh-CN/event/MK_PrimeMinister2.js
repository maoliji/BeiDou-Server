var eventTime = 10 * 60 * 1000;     // 10分钟（毫秒）
var entryMap = 106021601;
var exitMap = 106021402;
var recruitMap = 106021402;

var minPlayers = 1, maxPlayers = 3;
var minLevel = 30, maxLevel = 255;

var minMapId = 106021601;
var maxMapId = 106021601;

var mobId = 3300008; // Prime Minister
const GameConfig = Java.type('org.gms.config.GameConfig');
minPlayers = GameConfig.getServerBoolean("use_enable_solo_expeditions") ? 1 : minPlayers;
if (GameConfig.getServerBoolean("use_enable_party_level_limit_lift")) {
    minLevel = 1;
    maxLevel = 999;
}

function init() {
    setEventRequirements();
}

function setEventRequirements() {
    var reqStr = "";
    reqStr += "\r\n   组队人数: ";
    reqStr += (maxPlayers - minPlayers >= 1) ? (minPlayers + " ~ " + maxPlayers) : minPlayers;

    reqStr += "\r\n   等级要求: ";
    reqStr += (maxLevel - minLevel >= 1) ? (minLevel + " ~ " + maxLevel) : minLevel;

    reqStr += "\r\n   时间限制: ";
    reqStr += (eventTime / 60000) + " 分钟"; // 修复：原显示毫秒，改为分钟

    em.setProperty("party", reqStr);
}

function getEligibleParty(party) {
    var eligible = [];
    var hasLeader = false;

    if (party.size() > 0) {
        var partyList = party.toArray();
        for (var i = 0; i < party.size(); i++) {
            var ch = partyList[i];
            if (ch.getMapId() == recruitMap && ch.getLevel() >= minLevel && ch.getLevel() <= maxLevel) {
                if (ch.isLeader()) hasLeader = true;
                eligible.push(ch);
            }
        }
    }

    if (!(hasLeader && eligible.length >= minPlayers && eligible.length <= maxPlayers)) {
        eligible = [];
    }
    return Java.to(eligible, Java.type('org.gms.net.server.world.PartyCharacter[]'));
}

function setup(difficulty, lobbyId) {
    var eim = em.newInstance("MK_PrimeMinister2_" + lobbyId);
    respawn(eim);
    return eim;
}

function afterSetup(eim) {}

function primeMinisterCheck(eim) {
    var map = eim.getMapInstance(entryMap);
    return !map.getAllPlayers().isEmpty();
}

function respawn(eim) {
    if (primeMinisterCheck(eim)) {
        eim.startEventTimer(eventTime);
        var weddinghall = eim.getMapInstance(entryMap);
        weddinghall.getPortal(1).setPortalState(false);
        
        const LifeFactory = Java.type('org.gms.server.life.LifeFactory');
        const Point = Java.type('java.awt.Point');
        weddinghall.spawnMonsterOnGroundBelow(LifeFactory.getMonster(mobId), new Point(292, 143));
    } else {
        eim.schedule("respawn", 10000);
    }
}

function playerEntry(eim, player) {
    var weddinghall = eim.getMapInstance(entryMap);
    player.changeMap(weddinghall, weddinghall.getPortal(1));
}

function scheduledTimeout(eim) {
    var party = eim.getPlayers();
    for (var i = 0; i < party.size(); i++) {
        playerExit(eim, party.get(i));
    }
    eim.dispose();
}

// 修复：玩家复活后检查剩余人数
function playerRevive(eim, player) {
    eim.unregisterPlayer(player);
    if (eim.getPlayers().size() < minPlayers) {
        end(eim);
    }
}

function playerDead(eim, player) {}

// 修复：玩家断线后检查剩余人数
function playerDisconnected(eim, player) {
    eim.unregisterPlayer(player);
    if (eim.getPlayers().size() < minPlayers) {
        end(eim);
    }
}

function monsterValue(eim, mobId) {
    return -1;
}

// 修复：强制停止计时器+清理所有玩家+销毁事件
function end(eim) {
    eim.stopEventTimer(); // 停止计时器，避免重复触发
    var party = eim.getPlayers();
    for (var i = 0; i < party.size(); i++) {
        playerExit(eim, party.get(i));
    }
    eim.dispose(); // 销毁事件实例，释放地图锁
}

// 修复：队伍离开/解散时结束事件
function leftParty(eim, player) {
    eim.unregisterPlayer(player);
    if (eim.getPlayers().size() < minPlayers) end(eim);
}

function disbandParty(eim) {
    end(eim); // 队伍解散直接结束事件
}

function playerUnregistered(eim, player) {}

// 修复：玩家离开后检查剩余人数，无玩家则结束事件
function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    player.changeMap(exitMap, 2);
    if (eim.getPlayers().isEmpty()) end(eim);
}

// 核心修复：修正参数错误+离开地图时结束事件
function changedMap(eim, chr, mapid) {
    if (mapid < minMapId || mapid > maxMapId) {
        eim.unregisterPlayer(chr);
        if (eim.getPlayers().size() < minPlayers) end(eim);
    }
}

// 修复：移除玩家后检查剩余人数
function removePlayer(eim, player) {
    eim.unregisterPlayer(player);
    player.getMap().removePlayer(player);
    player.setMap(entryMap);
    if (eim.getPlayers().size() < minPlayers) end(eim);
}

function cancelSchedule() {}

function dispose() {}

// 修复：BOSS击杀后延迟检查，避免玩家未捡奖励就结束
function clearPQ(eim) {
    eim.stopEventTimer();
    eim.setEventCleared();
    eim.schedule(function() {
        if (eim.getPlayers().isEmpty()) end(eim);
    }, 5000);
}

function monsterKilled(mob, eim) {
    if (mob.getId() == mobId) {
        var entryMapInst = eim.getMapInstance(entryMap);
        entryMapInst.getPortal(1).setPortalState(true);
        eim.showClearEffect();
        eim.clearPQ();
    }
}

function allMonstersDead(eim) {}
function changedLeader(eim, leader) {}