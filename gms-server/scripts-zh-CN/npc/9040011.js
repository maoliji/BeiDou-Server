/*
	This file is part of the OdinMS Maple Story Server
    Copyright (C) 2008 Patrick Huy <patrick.huy@frz.cc>
		       Matthias Butz <matze@odinms.de>
		       Jan Christian Meyer <vimes@odinms.de>

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
function start() {
    cm.sendOk("<通知> \r\n 你是属于一个拥有足够勇气和信任的家族吗？那就接受家族任务的挑战吧！\r\n\r\n#b参与条件：#k\r\n1. 家族必须至少有6名成员！\r\n2. 家族任务的领导必须是家族的族长或副组长！\r\n3.如果参与家族任务的成员数量少于6人，或者队长决定提前结束任务，家族任务可能会提前结束！\r\n#b(单人可进入挑战，但最好开两个号方便过第1关和倒数第2关，此时不限制小号等级)#k");
    cm.dispose();
}