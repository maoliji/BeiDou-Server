/*2101014.js - Lobby and Entrance
 * @author Jvlaple
 * For Jvlaple's AriantPQ
 */

var status = 0;
var toBan = -1;
var choice;
var arenaType;
var arena;
var arenaName;
var type;
var map;
const ExpeditionType = Java.type('org.gms.server.expeditions.ExpeditionType');
var exped = ExpeditionType.ARIANT;
var exped1 = ExpeditionType.ARIANT1;
var exped2 = ExpeditionType.ARIANT2;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1) {
        cm.dispose();
    } else {
        if (mode == 0 && status == 0) {
            cm.dispose();
            return;
        }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }
        if (cm.getPlayer().getMapId() == 980010000) {
            if (cm.getLevel() > 201) { //不限制等级
                cm.sendOk("你已经超过了#r等级30#k，因此你不能再参与这个副本了。");
                cm.dispose();
                return;
            }

            if (status == 0) {
                var expedicao = cm.getExpedition(exped);
                var expedicao1 = cm.getExpedition(exped1);
                var expedicao2 = cm.getExpedition(exped2);

                var channelMaps = cm.getClient().getChannelServer().getMapFactory();
                var startSnd = "你想干什么? \r\n\r\n\t#e#r(选择一个阿里安特竞技场)#n#k\r\n#b";
                var toSnd = startSnd;

                if (expedicao == null) {
                    toSnd += "#L0#竞技场(1) (空)#l\r\n";
                } else if (channelMaps.getMap(980010101).getCharacters().isEmpty()) {
                    toSnd += "#L0#参加竞技场(1)  擂主(" + expedicao.getLeader().getName() + ")" + "当前有: " + cm.getExpeditionMemberNames(exped) + "\r\n";
                }
                if (expedicao1 == null) {
                    toSnd += "#L1#竞技场(2) (空)#l\r\n";
                } else if (channelMaps.getMap(980010201).getCharacters().isEmpty()) {
                    toSnd += "#L1#参加竞技场(2)  擂主(" + expedicao1.getLeader().getName() + ")" + " 当前有: " + cm.getExpeditionMemberNames(exped1) + "\r\n";
                }
                if (expedicao2 == null) {
                    toSnd += "#L2#竞技场(3) (空)#l\r\n";
                } else if (channelMaps.getMap(980010301).getCharacters().isEmpty()) {
                    toSnd += "#L2#参加竞技场(3)  擂主(" + expedicao2.getLeader().getName() + ")" + " 当前有: " + cm.getExpeditionMemberNames(exped2) + "\r\n";
                }
                if (toSnd === startSnd) {
                    cm.sendOk("所有的战斗竞技场都已经被占用。我建议你稍后再回来，或者换个频道。");
                    cm.dispose();
                } else {
                    cm.sendSimple(toSnd);
                }
            } else if (status == 1) {
                arenaType = selection;
                expedicao = fetchArenaType();
                if (expedicao == "") {
                    cm.dispose();
                    return;
                }

                if (expedicao != null) {
                    enterArena(-1);
                } else {
                    cm.sendGetText("想允许多少人参加战斗? (2~5人)");
                }
            } else if (status == 2) {
                var players = parseInt(cm.getText());   // AriantPQ option limit found thanks to NarutoFury (iMrSiN)
                if (isNaN(players)) {
                    cm.sendNext("请在您的实例中输入允许玩家数量的数值限制。");
                    status = 0;
                } else if (players < 2) {
                    cm.sendNext("数值限制值不应少于2名玩家。");
                    status = 0;
                } else {
                    enterArena(players);
                }
            }
        }
    }
}

function fetchArenaType() {
    switch (arenaType) {
        case 0 :
            exped = ExpeditionType.ARIANT;
            expedicao = cm.getExpedition(exped);
            map = 980010100;
            break;
        case 1 :
            exped = ExpeditionType.ARIANT1;
            expedicao = cm.getExpedition(exped);
            map = 980010200;
            break;
        case 2 :
            exped = ExpeditionType.ARIANT2;
            expedicao = cm.getExpedition(exped);
            map = 980010300;
            break;
        default :
            exped = null;
            map = 0;
            expedicao = "";
    }

    return expedicao;
}

function enterArena(arenaPlayers) {
    expedicao = fetchArenaType();
    if (expedicao == "") {
        cm.dispose();

    } else if (expedicao == null) {
        if (arenaPlayers != -1) {
            var res = cm.createExpedition(exped, true, 0, arenaPlayers);
            if (res == 0) {
                cm.warp(map, 0);
                cm.getPlayer().dropMessage("请等其他玩家加入.");
            } else if (res > 0) {
                cm.sendOk("对不起,你今天的次数已经用完...");
            } else {
                cm.sendOk("出错了,请汇报管理员.");
            }
        } else {
            cm.sendOk("出错了,请汇报管理员.");
        }

        cm.dispose();
    } else {
        if (playerAlreadyInLobby(cm.getPlayer())) {
            cm.sendOk("抱歉，你已经在大厅里了。");
            cm.dispose();
            return;
        }

        var playerAdd = expedicao.addMemberInt(cm.getPlayer());
        if (playerAdd == 3) {
            cm.sendOk("抱歉，大厅现在已经满了。");
            cm.dispose();
        } else {
            if (playerAdd == 0) {
                cm.warp(map, 0);
                cm.dispose();
            } else if (playerAdd == 2) {
                cm.sendOk("对不起,队长不让你进去.");
                cm.dispose();
            } else {
                cm.sendOk("错误。");
                cm.dispose();
            }
        }
    }
}

function playerAlreadyInLobby(player) {
    return cm.getExpedition(ExpeditionType.ARIANT) != null && cm.getExpedition(ExpeditionType.ARIANT).contains(player) ||
        cm.getExpedition(ExpeditionType.ARIANT1) != null && cm.getExpedition(ExpeditionType.ARIANT1).contains(player) ||
        cm.getExpedition(ExpeditionType.ARIANT2) != null && cm.getExpedition(ExpeditionType.ARIANT2).contains(player);
}