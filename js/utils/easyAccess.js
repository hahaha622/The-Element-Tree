function hasUpgrade(layer, id) {
	return ((player[layer].upgrades.includes(toNumber(id)) || player[layer].upgrades.includes(id.toString())) && !tmp[layer].deactivated)
}

function hasMilestone(layer, id) {
	return ((player[layer].milestones.includes(toNumber(id)) || player[layer].milestones.includes(id.toString())) && !tmp[layer].deactivated)
}

function hasAchievement(layer, id) {
	return ((player[layer].achievements.includes(toNumber(id)) || player[layer].achievements.includes(id.toString())) && !tmp[layer].deactivated)
}

function hasChallenge(layer, id) {
	return ((player[layer].challenges[id]) && !tmp[layer].deactivated)
}

function maxedChallenge(layer, id) {
	return ((player[layer].challenges[id] >= tmp[layer].challenges[id].completionLimit) && !tmp[layer].deactivated)
}

function challengeCompletions(layer, id) {
	return (player[layer].challenges[id])
}

function canEnterChallenge(layer, id){
	return tmp[layer].challenges[id].canEnter ?? true
}

function canExitChallenge(layer, id){
	return tmp[layer].challenges[id].canExit ?? true
}

function getBuyableAmount(layer, id) {
	return (player[layer].buyables[id])
}

function setBuyableAmount(layer, id, amt) {
	player[layer].buyables[id] = amt
}

function addBuyables(layer, id, amt) {
	player[layer].buyables[id] = player[layer].buyables[id].add(amt)
}

function getClickableState(layer, id) {
	return (player[layer].clickables[id])
}

function setClickableState(layer, id, state) {
	player[layer].clickables[id] = state
}

function getGridData(layer, id) {
	return (player[layer].grid[id])
}

function setGridData(layer, id, data) {
	player[layer].grid[id] = data
}

function upgradeEffect(layer, id) {
	return (tmp[layer].upgrades[id].effect)
}

function challengeEffect(layer, id) {
	return (tmp[layer].challenges[id].rewardEffect)
}

function buyableEffect(layer, id) {
	return (tmp[layer].buyables[id].effect)
}

function clickableEffect(layer, id) {
	return (tmp[layer].clickables[id].effect)
}

function achievementEffect(layer, id) {
	return (tmp[layer].achievements[id].effect)
}

function gridEffect(layer, id) {
	return (gridRun(layer, 'getEffect', player[layer].grid[id], id))
}

function layerText(elem, layer, text) {
	return "<" + elem + " style='color:" + tmp[layer].color + ";text-shadow:0px 0px 10px;'>" + text + "</" + elem + ">"
}

function colorText(elem, color, text) {
	return "<" + elem + " style='color:" + color + ";text-shadow:0px 0px 10px;'>" + text + "</" + elem + ">"
}

function nonshadowcolorText(elem, color, text) {
	return "<" + elem + " style='color:" + color + "'>" + text + "</" + elem + ">"
}

function applyeffect(layer,upg,num) {
    if(hasUpgrade(layer, upg)) {return num.times(upgradeEffect(layer, upg))}
    else {return num}
}

function applyexpeffect(layer,upg,num) {
    if(hasUpgrade(layer, upg)) {return num.pow(upgradeEffect(layer, upg))}
    else {return num}
}

function applybuyeffect(layer,buy,num) {
    if(tmp[layer].buyables[buy].unlocked) {return num.times(buyableEffect(layer, buy))}
    return num
}

function applysoftcap(start,exp,cur){
if(cur.gte(start)) return new Decimal (cur).div(start).pow(exp).times(start)
return cur
}

function applydilatesoftcap(start,exp,cur){
if(cur.gte(start)) return cur.div(start).times(10).dilate(exp).times(start).div(10)
return cur
}

function applylogsoftcap(start,log,cur){
if(cur.gte(start)) return cur.div(start).log(log).times(start)
return cur
}