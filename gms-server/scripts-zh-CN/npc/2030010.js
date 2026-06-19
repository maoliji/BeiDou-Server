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

/* Amon
 * 
 * @Author Stereo
 * Adobis's Mission I : Breath of Lava <Level 1> (280020000)
 * Adobis's Mission I : Breath of Lava <Level 2> (280020001)
 * Last Mission : Zakum's Altar (280030000)
 * Zakum Quest NPC 
 * Helps players leave the map
 */

var cost = 5000000;
var status = 0;


function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {

    if (status >= 0 && mode == 0) {
        cm.dispose();
        return;
    }
        if (mode == 1) {
            status++;
        } else {
            status--;
        }    
        if (status == 0) {
		if (cm.getMapId() == 280030000) {
	        if (!cm.getEventInstance().isEventCleared()) {
	            cm.sendYesNo("如果你现在离开，你将不得不重新开始。你确定要离开吗？");
	        } else {
	            cm.sendYesNo("你们终于打败了扎昆，真是了不起的壮举！恭喜！你确定现在要离开吗？");
	        }
		} else if (cm.getMapId() == 280020000 || cm.getMapId() == 280020001) {	
	            cm.sendSimple("你是想要付费跳过此关，还是选择离开？\r\n#b#L0#付费500W金币跳过此关\r\n\r\n#L1#离开此地#l");
	        } else {
		cm.sendSimple("...");
        	cm.dispose();
		}
	} else if (status == 1) {
	
               if (selection == 0 && cm.getMeso() >= cost) {		
                	cm.gainMeso(-cost);		
	    	cm.warp(280020001,5);
		cm.dispose();
                } else if (selection == 0) {
                    cm.sendOk("你没有足够的金币！");
                    cm.dispose();
		} else {
	    	cm.warp(211042300);
		cm.dispose();
		}
	} else {

		cm.dispose();
            } 


}
