/*
 * 稻草人伤害测试 (单人)
 * 限时 1 分钟，生成 21 亿血稻草人，记录伤害并播报。
 */

var eventTime = 1;               // 分钟
var minPlayers = 1, maxPlayers = 1;
var minLevel = 1, maxLevel = 200;
var entryMap = 103000890;        // 测试地图 ID（请替换为你的副本地图）
var exitMap = 910000088;         // 结束后返回的地图 ID

var monsterId = 9001007;
var targetHp = 2100000000;
var maxHpLimit = 2147483647;     // Java int 上限

function init() {
    // 设置组队/等级要求（显示在 NPC 对话中）
    var reqStr = "\r\n   组队人数: 1";
    reqStr += "\r\n   等级要求: " + minLevel + " ~ " + maxLevel;
    reqStr += "\r\n   时间限制: " + eventTime + " 分钟";
    em.setProperty("party", reqStr);
}

// 事件实例启动
function setup(level, lobbyid) {
    var eim = em.newInstance("StrawMan" + lobbyid);
    eim.setProperty("level", level);

    // 初始化玩家伤害记录
    eim.setIntProperty("totalDamage", 0);

    // 生成稻草人
    var map = eim.getMapInstance(entryMap);
    if (map == null) {
        eim.dispose();
        return null;
    }

    const LifeFactory = Java.type('org.gms.server.life.LifeFactory');
    var mob = LifeFactory.getMonster(monsterId);
    if (mob == null) {
        eim.dispose();
        return null;
    }

    var finalHp = targetHp > maxHpLimit ? maxHpLimit : targetHp;
    mob.setStartingHp(finalHp);
    //mob.setMp(finalHp);  // 避免空 MP 条

    // 生成怪物（位置可根据地图调整）
    var spawnPos = new java.awt.Point(0, -42);
    map.spawnMonsterOnGroundBelow(mob, spawnPos);

    // 启动 1 分钟倒计时
    eim.startEventTimer(eventTime * 60000);
    return eim;
}

function afterSetup(eim) {}

function playerEntry(eim, player) {
    var map = eim.getMapInstance(entryMap);
    player.changeMap(map, map.getPortal(0));
}

// 当怪物受到伤害时由服务端调用（需服务端扩展支持）
function monsterDamaged(eim, mob, attacker, damage) {
    if (attacker.getType() == org.gms.server.maps.MapObjectType.PLAYER) {
        var pid = attacker.getId();
        var key = "dmg_" + pid;
        var old = eim.getIntProperty(key);
        eim.setIntProperty(key, old + damage);
        var totalOld = eim.getIntProperty("totalDamage");
        eim.setIntProperty("totalDamage", totalOld + damage);
    }
}

// 时间到
function scheduledTimeout(eim) {
    var totalDamage = eim.getIntProperty("totalDamage");
    var secs = eventTime * 60;
    var dps = (totalDamage / secs).toFixed(2);

    eim.broadcastPlayerMsg(5, "【稻草人挑战结束】");
    eim.broadcastPlayerMsg(5, "总伤害：" + totalDamage);
    eim.broadcastPlayerMsg(5, "秒伤害：" + dps);
    end(eim);
}

function end(eim) {
    var players = eim.getPlayers();
    for (var i = 0; i < players.size(); i++) {
        var player = players.get(i);
        var map = player.getClient().getChannelServer().getMapFactory().getMap(exitMap);
        player.changeMap(map, map.getPortal(0));
    }
    eim.dispose();
}

// 必要的事件钩子（可空实现）
function playerUnregistered(eim, player) {}
function playerExit(eim, player) {
    eim.unregisterPlayer(player);
    player.changeMap(exitMap, 0);
}
function playerLeft(eim, player) {
    playerExit(eim, player);
}
function playerDisconnected(eim, player) {
    eim.unregisterPlayer(player);
}
function playerDead(eim, player) {}
function playerRevive(eim, player) {
    eim.unregisterPlayer(player);
    player.changeMap(exitMap, 0);
}
function changedMap(eim, player, mapid) {
    if (mapid != entryMap) {
        playerExit(eim, player);
    }
}
function monsterKilled(mob, eim) {}
function allMonstersDead(eim) {}
function monsterValue(eim, mobId) {
    return 1;
}
function cancelSchedule() {}
function dispose(eim) {}