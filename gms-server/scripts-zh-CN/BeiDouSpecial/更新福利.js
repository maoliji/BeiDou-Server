/*
脚本：更新福利礼包
作者：里脊
日期：2026-5-22
备注：北斗开发组
 */

var status;
var textMsg;
//Start
function start() 
{
  status = -1;
  action(1, 0, 0);
}

function action(mode, type, selection) 
{
	if (CheckStatus(mode))
	{
	    if (status == 0)
	    {
			var strGetText = cm.getCharacterExtendValue("更新福利礼包");
			if (cm.getPlayer().getLevel()<120 || strGetText == "已领取") 
			{
 				cm.sendOk("您已经领取了奖励或者等级不足120级。每个120级以上角色#r限领一次。#k");
				cm.dispose();
			}
			else
			{
				cm.sendAcceptDecline("您确定要领取更新礼包吗？一个角色#r限领一次。#k");	
			}
		}
		else if (status == 1 )
		{
			//第二层对话
		    cm.saveOrUpdateCharacterExtendValue("更新福利礼包", "已领取");
		    cm.gainItem(4001126,1000);
		    cm.sendOk("恭喜您获得更新奖励，祝您游戏愉快！");
		    cm.dispose();			
		}
		else
		{
			//最后一层对话完继续循环至此，推出结束
			cm.dispose();
		}
	}
			
}

function CheckStatus(mode)
{
	if (mode == -1)
	{
		cm.dispose();
		return false;
	}
	
	if (mode == 1)
	{
		status++;
	}
	else
	{
		status--;
	}
	
	if (status == -1)
	{
		cm.dispose();
		return false;
	}	
	return true;
}