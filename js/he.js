addLayer("he", {
    name: "helium", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "He", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData(){
        return {
            unlocked: true,
    		points: new Decimal(0),
        }
    },
    color: "#D4FBF9",
    requires: new Decimal('1e10'), // Can be a function that takes requirement increases into account
    resource: "helium", // Name of prestige currency
    baseResource: "hydrogen", // Name of resource prestige is based on
    baseAmount() {return player.h.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.01, // Prestige currency exponent
    row: 1, // Row the layer is in on the tree (0 is the first row)
    getResetGain(){
    let gain = decimalZero
    if(player.h.points.gte(this.requires)&&this.layerShown())gain = this.baseAmount().div(this.requires).pow(this.exponent)
    let mult = decimalOne
    mult = applyeffect('he',12,mult)
    mult = applyeffect('he',21,mult)
    mult = applyeffect('he',25,mult)
    mult = applyeffect('h',43,mult)
    mult = mult.times(tmp.li.effect)
    mult = mult.times(tmp.h.shboost)
    mult = mult.times(tmp.h.stellaseff)
    let exp = decimalOne
    gain = gain.times(mult).pow(exp)
    return gain
    },
    effect(){
    if(!hasUpgrade('he',11))return decimalOne
    let exp = new Decimal(1.284)
    let eff = player.he.points.pow(exp).max(1)
    eff = applybuyeffect('he',11,eff)
    eff = eff.times(tmp.h.sheboost)
    return eff.max(1)
    },
    effectDescription() {
    let text = undefined
    if(hasUpgrade('he',11))text = "previous resource times " + layerText('h2', this.layer, format(tmp[this.layer].effect))
    return text
    },
    tabFormat: {
        "Main": {
            content: [
              ["main-display",2],
              'resource-display',
              "upgrades",
            ],
            shouldNotify(){
            return tmp.he.upgnotify
            },
        },
        "Buyables": {
            content: [
              ["main-display",2],
              'resource-display',
              "buyables",
            ],
            shouldNotify(){
            return tmp.he.buyables[11].canAfford &&!hasUpgrade('he', 31)
            },
            unlocked(){
            return hasUpgrade('he', 15)
            },
        },
    },
    upgrades: {
        11: {
            title: "helium I",
            description: "unlock helium effect",
            cost: new Decimal(10),
        },
        12: {
            title: "helium II",
            description: "point boost helium",
            cost: new Decimal(40),
            effect(){
                let mult = player.points.max(1).log(1.12).pow(0.2).max(1)
                return mult
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + 'x' }, // Add formatting to the effect
            unlocked() {
            return hasUpgrade('he', 11)
            },
        },
        13: {
            title: "helium III",
            description: "unlock stella in hydrogen",
            cost: new Decimal(180),
            unlocked() {
            return hasUpgrade('he', 12)
            },
        },
        14: {
            title: "helium IV",
            description: "unlock stella size effect",
            cost: new Decimal(5000),
            unlocked() {
            return hasUpgrade('he', 13)
            },
        },
        15: {
            title: "helium V",
            description: "unlock a buyable",
            cost: new Decimal(20000),
            unlocked() {
            return hasUpgrade('he', 14)
            },
        },
        21: {
            title: "helium VI",
            description: "helium effect also boost helium",
            cost: new Decimal(200000),
            effect(){
                let mult = tmp.he.effect.max(1).log(1.47).pow(1.6).max(1)
                return mult
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + 'x' }, // Add formatting to the effect
            unlocked() {
            return hasUpgrade('he', 15)
            },
        },
        22: {
            title: "helium VII",
            description: "helium also boost stella size",
            cost: new Decimal(50000000),
            effect(){
                let mult = player.he.points.max(1).log(2.71).pow(1.47).max(1)
                return mult
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + 'x' }, // Add formatting to the effect
            unlocked() {
            return hasUpgrade('he', 21)
            },
        },
        23: {
            title: "helium VIII",
            description: "improve stella size",
            cost: new Decimal(77777777),
            effect(){
                return new Decimal(1.21).div(5.31)
            },
            unlocked() {
            return hasUpgrade('he', 22)
            },
        },
        24: {
            title: "helium IX",
            description: "storage all your hydrogen gain to your stella and dosen't spend,disable the first stella clickable",
            cost: new Decimal('5e9'),
            unlocked() {
            return hasUpgrade('he', 23)
            },
        },
        25: {
            title: "helium X",
            description: "the second clickables effect always apply,dosen't spend storaged  hydrogen,disable it,gain 10x helium,unlock a hydrogen upgrade",
            cost: new Decimal('1e10'),
            effect: new Decimal(10),
            unlocked() {
            return hasUpgrade('he', 24)
            },
        },
        31: {
            title: "helium XI",
            description: "remove 2nd hydrogen softcap,effect booster cost exp is 2,auto buy it",
            cost: new Decimal('1e67'),
            effect(){
            let exp = new Decimal(0.71)
            return exp
            },
            unlocked() {
            return hasUpgrade('h', 45)
            },
        },
        32: {
            title: "helium XII",
            description: "stella size boost points",
            cost: new Decimal('5e114'),
            effect(){
            let exp = new Decimal(0.78)
            let eff = tmp.h.stellasize.pow(exp)
            return eff.max(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + 'x' }, // Add formatting to the effect
            unlocked() {
            return hasUpgrade('he', 31)
            },
        },
        33: {
            title: "helium XIII",
            description: "prepare to lithum!let hydrogen point softcap weak (log->dilate to^0.25)!!",
            cost: new Decimal('1.5e115'),
            unlocked() {
            return hasUpgrade('he', 32)
            },
        },
        34: {
            title: "helium XIV",
            description: "next prepare!4th hydrogen softcap start is 1e1000,3rd hydrogen point softcap start is raised to ln(ln(ln(stella IXeffect+1)+1)+1)+1!!",
            cost: new Decimal('1e130'),
            effect (){
            let eff = upgradeEffect('h', 44)
            eff = eff.add(1).ln().add(1).ln().add(1).ln().add(1).max(1)
            return eff
            },
            effectDisplay() {return '^' + format(upgradeEffect(this.layer, this.id))},
            unlocked() {
            return hasUpgrade('he', 33)
            },
        },
        35: {
            title: "helium XIV",
            description: "unlock lithum,4th hydrogen softcap start is 1e2000,3th hydrogen softcap is weaker(^0.01->^0.1)!!",
            cost: new Decimal('1e133'),
            effect (){
            let eff = new Decimal(10)
            
            return eff
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id)) + 'x'},
            unlocked() {
            return hasUpgrade('he', 34)
            },
        },
    },
    buyables: {
        11: {
            title: "effect booster",
            unlocked() {
             return hasUpgrade('he', 15)
            },
            baseamt(){
            return player.he.points
            },
            base(){
            let base = new Decimal(20000)
            return base
            },
            exp(){
            let exp = new Decimal(5)
            return exp
            },
            exp2(){
            let exp2 = new Decimal(2.71)
            if(hasUpgrade('he', 31)) exp2 = exp2.sub(upgradeEffect('he', 31))
            return exp2
            },
            cost(x) {
            return tmp[this.layer].buyables[this.id].base.times(new Decimal(tmp[this.layer].buyables[this.id].exp).pow(x.pow(tmp[this.layer].buyables[this.id].exp2)))
            },
            display() {
                return format(layers[this.layer].buyables[this.id].effect(1)) + "x effect" + "<br>Amount: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "<br>Currently: " + format(buyableEffect(this.layer, this.id)) + 'x' + "<br>Cost: " + formatWhole(tmp[this.layer].buyables[this.id].cost) + " helium"
            },
            canAfford() {
                let can = this.baseamt().gte(this.cost())
                return can
            },
            buy() {
                let cost = new Decimal (1)
                player[this.layer].points = player[this.layer].points.sub(this.cost().mul(cost))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {
                if(hasUpgrade('he', 31)){
                    let amount = player.he.points.div(tmp[this.layer].buyables[this.id].base).max(1).log(tmp[this.layer].buyables[this.id].exp).root(tmp[this.layer].buyables[this.id].exp2).ceil()
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(amount))
                }
            },
            effect(x) {
                let everyeff = player.he.points.max(1).log(14.1132).max(1)
                everyeff = applyexpeffect('h',41,everyeff)
                let eff = everyeff.pow(x)
                return eff.max(1)
            },
        },
    },
    update(diff){
    tmp.he.buyables[11].buyMax()
    },
    passiveGeneration: new Decimal(1),
    layerShown(){return hasUpgrade('h', 25)}
})
