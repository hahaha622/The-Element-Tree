let modInfo = {
	name: "The Element Tree",
	author: "hahaha",
	pointsName: "points",
	modFiles: ["t.js", "h.js", "he.js", "li.js", "tree.js"],

	discordName: "Visit author",
	discordLink: "https://b23.tv/xM5Rats",
	initialStartPoints: new Decimal(0), // Used for hard resets and new players
}

// Set your version in num and name
let VERSION = {
	num: "0.1beta-3alpha",
	name: "1th release + more content^2",
}

let changelog = `
<h1>CURRENT ENDGAME:</h1><br>
<h2>buy 'lithum III' upgrade</h2><br><br>
<h1>CHANGELOG</h1>

<br><br><h2>pre release stage</h2>

<br><br><h3>0.1beta-3alpha</h3>
<br>rewrite most of the code
<br>update to lithum III upgrade

<br><br><h3>0.1beta-2alpha</h3>
<br>more upgs
<br>prepare to unlock Li

<br><br><h3>0.1beta</h3>
<br>20upgs
<br>about 10min content


`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let mult = decimalOne
	mult = mult.times(tmp.h.effect)
	mult = mult.times(tmp.he.effect)
	mult = mult.times(tmp.li.effect)
	mult = mult.times(buyableEffect('h', 11))
	mult = applyeffect('he',32,mult)
	let exp = decimalOne
	exp = applyeffect('h',44,exp)
	let gain = new Decimal(1)
	return gain.times(mult).pow(exp)
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return false
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
