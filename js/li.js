addLayer("li", {
    name: "lithum", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Li", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData(){
        return {
            unlocked: true,
    		points: decimalZero,
        }
    },
    color: "#CC7EFC",
    requires: new Decimal("1.34e154"), // Can be a function that takes requirement increases into account
    resource: "lithum", // Name of prestige currency
    baseResource: "helium", // Name of resource prestige is based on
    baseAmount() {return player.he.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    row: 2, // Row the layer is in on the tree (0 is the first row)
    getResetGain(){
        let gain = decimalZero
        let gainexp = decimalOne
        gainexp = applyeffect('li',12,gainexp)
        if(this.baseAmount().gte(this.requires))gain = this.baseAmount().div("1.34e150").log(10).div(4).pow(gainexp)
        
        //boost
        //mult
        let mult = decimalOne
        //exp
        let exp = decimalOne
        gain = gain.times(mult).pow(exp)
        //softcap
        return gain
    },
    effect(){
    if(!hasUpgrade('li',11))return decimalOne
    let eff = decimalOne
    eff = player.li.points.max(1).pow(2.71)
    return eff
    },
    effectDescription() {
    let text = undefined
    if(hasUpgrade('li',11))text = "previous resource times " + layerText('h2', this.layer, format(tmp[this.layer].effect))
    return text
    },
    tabFormat: {
        "Main": {
            content: [
                ["main-display",2],
                'resource-display',
                ["upgrades",[1,2,3,4]],
            ],
        },
    },
    upgrades: {
        11: {
            title: "lithum I",
            description: "unlock lithum effect,hydrogen point softcap strength/2",
            cost: new Decimal('10'),
            effect(){
                return new Decimal(0.5)
            },
        },
        12: {
            title: "lithum II",
            description: "lithum base gain is squared",
            cost: new Decimal('1100'),
            effect(){
                return new Decimal(2)
            },
            unlocked() {
                return hasUpgrade('li', 11)
            },
        },
        13: {
            title: "lithum III",
            description: "helium XIV also effect 4th hydrogen softcap,hydrogen point softcap is more weak(dilate to ^0.25 -> dilate to ^0.35)",
            cost: new Decimal('11000'),
            effect(){
                return upgradeEffect('he', 34)
            },
            unlocked() {
                return hasUpgrade('li', 12)
            },
        },
        /*14: {
            title: "lithum IV",
            description: "uncap hydrogen VIII,also effect effect booster,cube it,and finally stella III also effect 4th softcap",
            cost: new Decimal('75000'),
            effect(){
                return upgradeEffect('h', 33)
            },
            unlocked() {
                return hasUpgrade('li', 13)
            },
        },*/
    },
    buyables: {
    },
    update(diff){
    },
    passiveGeneration: new Decimal(1),
    layerShown(){return hasUpgrade('he', 35)}
})
