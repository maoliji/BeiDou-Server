/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc> 
                       Matthias Butz <matze@odinms.de>
                       Jan Christian Meyer <vimes@odinms.de>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License version 3
    as published by the Free Software Foundation. You may not use, modify
    or distribute this program under any other version of the
    GNU Affero General Public License.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 -- Odin JavaScript --------------------------------------------------------------------------------
 Konpei - Showa Town(801000000)
 -- By ---------------------------------------------------------------------------------------------
 Information
 -- Version Info -----------------------------------------------------------------------------------
 1.1 - Fixed by Moogra
 1.0 - First Version by Information
 ---------------------------------------------------------------------------------------------------
 **/
var status = 0;

function start() {
    cm.sendSimple("你想从我这里得到什么？\r\n#L0##b收集一些有关<火狸金融>的信息。#l\r\n#L1#带我去<火狸金融>。#l\r\n#L2#什么都不要。#k");
}

function action(mode, type, selection) {
    if (mode < 1) {
        cm.dispose();
    } else {
        status++;
        if (status == 1) {
            if (selection == 0) {
                cm.sendNext("我可以带你去火狸金融，但那个地方到处都是寻衅滋事的暴徒。你需要既非常强壮又勇敢才能进入那个地方。在火狸金融，你会找到控制这个地区所有其他头目的大亲分。到达火狸金融很容易，但那个地方顶层的房间每天只能进入一次。大亲分的房间不是一个可以胡闹的地方。我建议你不要在那里待得太久；一旦进去，你需要迅速处理好事情。大亲分本人是一个强大的对手，但在去见他的路上你会遇到一些实力很强的家伙！这并不会容易。");
                cm.dispose();
            } else if (selection == 1) {
                cm.sendNext("哦，勇者啊。如果继续放任他们不管，就无法挽回了。在那之前，用你的力量惩罚他们，千万不要大意，大亲分是很多勇者都敌不过的人，但是看着你的眼睛，我确信你一定会成功的。");
            } else {
                cm.sendOk("我很忙！如果你只是需要这个，就别打扰我！");
                cm.dispose();
            }
        } else {
            cm.warp(801040000, "in00");
            cm.dispose();
        }
    }
}