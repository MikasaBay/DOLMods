const oldPass = Time.pass

const TimeHandle = {
	prevDate : {},
	currentDate : {},
	passTime : function(){
		const { currentDate, prevDate } = this

		return {
			sec : currentDate.second - prevDate.second,
			min : currentDate.minute - prevDate.minute,
			day : currentDate.day - prevDate.day,
			hour : currentDate.hour - prevDate.hour,
			month : currentDate.month - prevDate.month,
			year : currentDate.year - prevDate.year,
			weekday : [prevDate.weekDay, currentDate.weekDay]
		}
	}
}

Time.pass = function(sec){
	const prevDate = new DateTime(V.startDate + V.timeStamp)
	const fragment = oldPass(sec)
	const currentDate = Time.date

	console.log('passed time:',sec)
	console.log('prevDate:',prevDate)
	console.log('currentDate:', currentDate)

	TimeHandle.prevDate = prevDate
	TimeHandle.currentDate = currentDate

	iTimeHandle(sec)
	if(V.combat == 1){
		iCombatHandle()
	}

	console.log('fragment:', fragment)
	if(fragment !== undefined){
		return fragment 
	}
	return ""
}

function iTimeHandle(passedSec){
	const { min, day, hour, month, year, weekday } = TimeHandle.passTime()
	console.log('time handle:', passedSec, min, day, hour, month, year, weekday)

	if(!T.addMsg){
		T.addMsg = ''
	}

	//非战斗模式不处理低于0分的变动
	if(passedSec <= 0) return;
	if(min <= 0 && V.combat == 0) return;


	//根据事件的计算单位执行进程，先是按分钟计算的事件。
	if(min > 0 || (passedSec > 0 && V.combat == 1)){
		minuteProcess(passedSec, min)
	}

	if(hour > 0){
		hourProcess(passedSec, hour)
	}

	if(day > 0){
		dayProcess(passedSec, day, weekday)
	}

	//每周的处理
	if(weekday[1] == 1 && weekday[0] !== 1){
		weekProcess(passedSec, day, weekday)
	}

}

function minuteProcess(sec, min){
	//-------------------------------------------------------------
	// 处理药物效果
	//-------------------------------------------------------------
		iCandy.DrugsProcess.minuteProcess(sec)

	//-------------------------------------------------------------
	// 处理额外效果
	//-------------------------------------------------------------
	const extraSense = R.extraSense
	for( const[type, sense] of Object.entries(extraSense)){
			iCandy.senseUpdate(sense, sec)
	}

	//-------------------------------------------------------------
	// 其他每小时处理
	//-------------------------------------------------------------

	//当饥饿过高时获得压力
	if(V.hunger >= C.hunger.max * 0.8 && min > 0){
		wikifier('stress', 1 * min, 10)
	}

}

function hourProcess(sec, hour){
	//-------------------------------------------------------------
	// 检测药物戒断状态
	//-------------------------------------------------------------
	iCandy.DrugsProcess.hourProcess()

	//-------------------------------------------------------------
	// 检测普通成瘾品的戒断状态
	//-------------------------------------------------------------
	iCandy.DrugsProcess.hourProcess('general')

	//-------------------------------------------------------------
	// 其他每小时处理
	//-------------------------------------------------------------

	//获得饥饿值
	V.hunger = Math.min(V.hunger + 100 * hour, C.hunger.max)

	//当饥饿值过高时，获得通知
	if(V.hunger >= C.hunger.max * 0.8){
		wikifier('stress', 8, 40)
		V.addMsg += lanSwitch(stateEffects.hungry) + '<<gstress>><br>'
	}
}


function dayProcess(sec, day, weekday){
	//-------------------------------------------------------------
	// 集算当日嗑药情况
	//-------------------------------------------------------------
	iCandy.DrugsProcess.dayProcess()

	//-------------------------------------------------------------
	// 集算酒精、尼古丁、催情类物质的情况
	//-------------------------------------------------------------
	iCandy.DrugsProcess.dayProcess('general')

	//-------------------------------------------------------------
	// 集算当日事件
	//-------------------------------------------------------------
	iCandy.DrugsProcess.eventCount()
	iCandy.DrugsProcess.eventCount('general')

	//-------------------------------------------------------------
	// 其他每日处理
	//-------------------------------------------------------------
	if(R.robot.power > 0){
		R.robot.power = Math.max(0, R.robot.power - 1)
	}

	R.flags.repairshop.today = 0;

	//事件flag的清理
	const chinatown = iEvent.getFlag('chinatown')
	for( let key in chinatown ){
		if(key.includes('today')){
			chinatown[key] = 0
		}
	}
}


function weekProcess(sec, day, weekday){

	//事件flag的清理
	iEvent.setFlag('chinatown', 'goatweek', 0)
}

function iCombatHandle(){
	const whitelistnpc = ['Avery', 'Briar', 'Darryl', 'Eden', 'Harper', 'Kylar', 'Landry', 'Morgan', 'Whitney', 'Winter', 'Remy', 'Wren', 'Keith', 'Cheng']
	//非战斗场景跳过
	if(V.combat == 0) return;
	if(V.stalk == true) return;
	//非白名单NPC跳过
	if(V.npc.length > 0 && !V.npc.has(...whitelistnpc)) return;

	//如果场景在学校，则看概率跳过
	if( V.location == 'school' && random(100) > 20) {
		R.combat.skip = true;
		return;
	}
	//如果场景在警察局，则看概率跳过
	if(V.location == 'police_station' && random(100) > 30){
		R.combat.skip = true;
		return;
	}
	//白名单NPC看概率跳过
	if(V.npc.length > 0 && V.npc.has(...whitelistnpc)  && V.consensual == 1 && !V.npc.has('Whitney', 'Morgan', 'Kylar') && random(100) > 40 ){
		R.combat.skip = true;
		return;
	}
	//已经跳过的，跳过
	if(R.combat.skip == true) return;


	//当pc处于反抗状态且处于优势时，跳过事件。
	if( V.pain < V.painmax * 0.8 
		&& V.enemyhealth < V.enemyhealthmax * 0.5 
		&& V.orgasmdown < 1 && V.rightarm !== 'bound' && V.leftarm !== 'bound' 
		&& V.leftleg !== 'bound' && V.rightleg !=='bound'
	) return;

	let rate = V.trauma/80 + V.stress/200
	const drugs = Items.search('drugs', 'or', 'pill', 'inject').filter( ([key, item]) => !item.id.has('angelpowder') && iCandy.getStat(item.id, 'efTimer') - V.timeStamp <= 1800 )
	console.log('combat feed drugs:',drugs)

	let html = ''


	//当敌人是触手或史莱姆或植物时，概率给pc上特殊分泌物
	if((V.enemytype == 'slime' || V.enemytype == 'tentacles' || V.enemytype == 'plant') && !iCandy.senseGet('genital', 'slime')){
		if(random(100) < 20 ){
			wikifier('drugs', 2000)
			iCandy.senseSet('genital', 'slime', 1.2, 3600)
			html += combatFeedMsg(V.enemytype, 'drugs')
			R.combat.slime = 1
		}
	}

	if(V.enemytype !== 'man') return;	
	//人类的情况，根据情况概率喂pc毒品

	for(let i = 0; i < V.enemynomax; i++){
		let npc = V.NPCList[i]
		//不能行动的，不是人类的，每个npc最多喂两次
		if(npc.stance == 'defeated' || npc.type !== 'human' || npc.feed >= 2){
			continue;
		}
		//如果pc有行动能力且npc血量过低，跳过
		if(V.pain < V.painmax && npc.health < npc.healthmax * 0.3 &&  V.orgasmdown < 1 && V.rightarm !== 'bound' && V.leftarm !== 'bound' && V.leftleg !== 'bound' && V.rightleg !=='bound'){
			continue;
		}

		if(npc.feed == undefined){
			npc.feed = 0
		}

		//当PC创伤或压力高于安全阈值时，NPC高概率喂PC天使粉。如果已经处于药效范围内，跳过
		if(V.trauma >= V.traumamax * 0.8 || V.stress >= V.stressmax * 0.8 ){

			if( iCandy.getStat('angelpowder', 'efTimer') > V.timeStamp ){
				continue;
			}

			if(random(100) < 40 && R.combat.angel < 1){
				html += combatFeedMsg(npc, 'angelpowder_inject')
				npc.feed++
				R.combat.angel++
				R.combat.total++
				continue;
			}

		}
		//其他情况根据创伤，疼痛，压力计算概率，随机喂PC毒品 
		if(random(100) <= rate && R.combat.total < 3 && drugs.length > 0 ){
			let [drugId, drug] = drugs.random()
			
			html += combatFeedMsg(npc, drugId)
			
			npc.feed++
			R.combat.total++
			continue;
		}

		//嘴巴空着的话，概率投喂春药、致幻剂
		
	}

	console.log('combat handle:',html)

	if(html.length > 2){
		V.afterMsg += html
	}

}


Object.defineProperties(window.iCandy, {
	iTimeHandle : { value : iTimeHandle, writable : false },
	iCombatHandle : { value : iCombatHandle, writable : false },
	minuteProcess : { value : minuteProcess, writable : false },
	hourProcess : { value : hourProcess, writable : false },
	dayProcess : { value : dayProcess, writable : false }
})