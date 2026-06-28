const contentseth ={
    softcaptext: [
        ["raw-html",
        function(){if(tmp.h.sc1able) return 'hydrogen is softcapped and exponent is ' + nonshadowcolorText("h2","#ff0000", '^' + '1/' + '5') + ' !(start at ' + nonshadowcolorText("h2","#ff0000", format(tmp.h.sc1start)) + ' )<br><br>'}
        ],
        ["raw-html",
        function(){if(tmp.h.sc2able) return 'hydrogen is softcapped and exponent is ' + nonshadowcolorText("h2","#ff0000", '^' + '1/' + format(player.h.sc2.pow('-1'))) + ' !(start at ' + nonshadowcolorText("h2","#ff0000", format(tmp.h.sc2start)) + ' )<br><br>'}
        ],
        ["raw-html",
        function(){if(tmp.h.sc3able) return 'hydrogen is softcapped and exponent is ' + nonshadowcolorText("h2","#ff0000", '^' + '1/' + format(tmp.h.sc3exp.pow('-1'))) + ' !(start at ' + nonshadowcolorText("h2","#ff0000", format(tmp.h.sc3start)) + ' )<br><br>'}
        ],
        ["raw-html",
        function(){if(tmp.h.sc4able) return 'hydrogen is softcapped and exponent is ' + nonshadowcolorText("h2","#ff0000", '^' + '1/' + format(player.h.sc4.pow('-1'))) + ' !(start at ' + nonshadowcolorText("h2","#ff0000", format(tmp.h.sc4start)) + ' )<br><br>'}
        ],
    ],
}

addLayer("h", {
    name: "hydrogen", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "H", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData(){
        return {
            unlocked: true,
    		points: decimalZero,
    		storagedh: decimalZero,
    		storagedhe: decimalZero,
    		isloseh: false,
    		sc2: decimalZero,
    		sc4: decimalZero,
        }
    },
    color: "#F8F8F8",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "hygrogen", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    row: 1, // Row the layer is in on the tree (0 is the first row)
    getResetGain(){
        let gain = decimalZero
        if(player.points.gte(this.requires))gain = player.points.div(this.requires).pow(this.exponent)
        //boost
        //mult
        let mult = decimalOne
        mult = applyeffect('h',13,mult)
        mult = applyeffect('h',16,mult)
        mult = mult.times(tmp.he.effect)
        mult = mult.times(tmp.li.effect)
        mult = mult.times(tmp.h.stellaseff)
        //exp
        let exp = decimalOne
        exp = applyeffect('h',32,exp)
        gain = gain.times(mult).pow(exp)
        //softcap
        /*
        part 1:
        start
        */
        //1
        let sc1start = new Decimal('1e10')
        let calcsc1exp = decimalOne
        calcsc1exp = applyeffect('h',33,calcsc1exp)
        sc1start = sc1start.pow(exp)
        //2
        let sc2start = new Decimal('1.79e308')
        //3
        let sc3start = new Decimal('1e400')
        sc3start = applyexpeffect('he',34,sc3start)
        //4
        let sc4start = new Decimal('1e800')
        if(hasUpgrade('he',34)) sc4start = sc4start.times('1e200')
        if(hasUpgrade('he',35)) sc4start = sc4start.times('1e1000')
        sc4start = applyexpeffect('li',13,sc4start)
        /*
        part 3:
        calc
        */
        //1
        if(gain.gte(sc1start)&&(!hasUpgrade('h', 42)))gain = applysoftcap(tmp.h.sc1start,0.2,gain)
        //2
        if(gain.gte(sc2start)&&(!hasUpgrade('he', 31))){
        let sc2exp = new Decimal(0.5)
        if(hasUpgrade('h',45)) sc2exp = sc2exp.add(0.3)
        let sc2 = new Decimal(sc2exp).pow(gain.max(1).log(10).sub(sc2start.max(1).log(10)).max(0))
        player.h.sc2 = sc2
        if(gain.gte(sc2start))gain = gain.div(sc2start).pow(sc2).times(sc2start)
        }
        //3
        let sc3exp = new Decimal(0.01)
        sc3exp = applyeffect('he',35,sc3exp)
        if(gain.gte(sc3start))gain = applysoftcap(sc3start,sc3exp,gain)
        //4
        let exp2 = gain.div(sc4start).max(1).log(10)
        let str = new Decimal('-0.9')
        str = applyeffect('li',11,str)
        exp1 = exp2.pow(str)
        player.h.sc4 = exp1
        gain = applysoftcap(sc4start,exp1,gain)
        return gain
    },
    sc1start(){
        let start = new Decimal('1e10')
        let exp = decimalOne
        exp = applyeffect('h',33,exp)
        return start.pow(exp)
    },
    sc1able(){
        return player.h.points.gte(tmp.h.sc1start)&&(!hasUpgrade('h', 42))
    },
    sc2start(){
        let start = new Decimal('1.79e308')
        return start
    },
    sc2able(){
        return player.h.points.gte(tmp.h.sc2start)&&(!hasUpgrade('he', 31))
    },
    sc3start(){
        let start = new Decimal('1e400')
        start = applyexpeffect('he',34,start)
        return start
    },
    sc3able(){
        return player.h.points.gte(tmp.h.sc3start)
    },
    sc3exp(){
        let exp = new Decimal(0.01)
        exp = applyeffect('he',35,exp)
        return exp
    },
    sc4start(){
        let start = new Decimal('1e800')
        if(hasUpgrade('he',34)) start = start.times('1e200')
        if(hasUpgrade('he',35)) start = start.times('1e1000')
        start = applyexpeffect('li',13,start)
        return start
    },
    sc4able(){
        return player.h.points.gte(tmp.h.sc4start)
    },
    effect(){
        if(!hasUpgrade('h',11)) return decimalOne
        let exp = new Decimal(1)
        let log = new Decimal(3)
        log = applyeffect('h',12,log)
        log = applyeffect('h',22,log)
        return player.h.points.max(1).log(log.min(1e15).add(1)).pow(exp).max(1)
    },
    effectDescription() {
        let text = undefined
        if(hasUpgrade('h',11))text = "point times " + layerText('h2', this.layer, format(tmp[this.layer].effect))
        return text
    },
    fullstella(){
        return player.h.storagedh.add(player.h.storagedhe)
    },
    stellasize(){
        let  = tmp.h.fullstella.div(1e15).pow(0.5).div(3.14)
         = applyeffect('he',22,)
        return 
    },
    stellaseff(){
        if(!hasUpgrade('he', 14)) return decimalOne
        let log = new Decimal(5.31)
        log = applyeffect('he',23,log)
        let effect = tmp.h.stellasize.times(10).max(1).log(log).max(1).pow(1.31)
        effect = applyexpeffect('h',41,effect)
        return effect
    },
    shboost(){
        if(!(player.h.isloseh||hasUpgrade('he', 25)))return decimalOne
        let exp = new Decimal(0.5)
        exp = applyeffect('h',35,exp)
        let effect = player.h.storagedh.div(1e15).max(1).log(1.01).pow(exp).max(1)
        effect = applyexpeffect('h',41,effect)
        return effect
    },
    sheboost(){
        if(!hasUpgrade('h', 31))return decimalOne
        return player.h.storagedhe.div(1e10).max(1).log(1.15).pow(4.71).max(1)
    },
    mustbr(){
	    return tmp.h.clickables[11].unlocked || tmp.h.clickables[12].unlocked ||tmp.h.clickables[13].unlocked
    },
    tabFormat: {
        "Main": {
            content: [
                ["main-display",2],
                'resource-display',
                ['column',contentseth.softcaptext],
                ["upgrades",[1,2]],
            ],
            shouldNotify(){
            return tmp.h.upgnotify
            },
        },
        "Buyables": {
            content: [
                ["main-display",2],
                'resource-display',
                ['column',contentseth.softcaptext],
                ["buyables",[1]],
            ],
            shouldNotify(){
            return tmp.h.buyables[11].canAfford && (!hasUpgrade('h', 42))
            },
            unlocked(){
            return hasUpgrade('h', 15)
            },
        },
        "Stella": {
            content: [
                ["main-display",2],
                'resource-display',
                ['column',contentseth.softcaptext],
                ["raw-html",
                function(){if (hasUpgrade('he', 13)) return 'Your stella size is ' + colorText('h2', '#FFE071', simpledist(tmp.h.stellasize)) + ((hasUpgrade('he', 14))?(' ,boost hydrogen and helium by ' + colorText('h2', '#FFE071', format(tmp.h.stellaseff))):'') + '<br><br>'}
                ],
                ["raw-html",
                function(){if (hasUpgrade('he', 13)) return 'Your storaged ' + layerText('h2', 'h', format(player.h.storagedh)) + ' hydrogen in your stella' + ((hasUpgrade('he', 25))?(',boost helium by ' + layerText('h2', 'h', format(tmp.h.shboost))):'') + '<br><br>'}
                ],
                ["raw-html",
                function(){if (hasUpgrade('he', 24)) return 'You are storaging ' + layerText('h2', 'h', format(tmp.h.resetGain)) + ' hydrogen to your stella per second<br><br>'}
                ],
                ["raw-html",
                function(){if (hasUpgrade('h', 31)) return 'Your storaged ' + layerText('h2', 'he', format(player.h.storagedhe)) + ' helium in your stella,boost helium effect by ' + layerText('h2', 'he', format(tmp.h.sheboost)) + '<br><br>'}
                ],
                ["raw-html",
                function(){if (hasUpgrade('h', 35)) return 'You are storaging ' + layerText('h2', 'he', format(tmp.he.resetGain)) + ' helium to your stella per second<br>'}
                ],
                ["raw-html",
                function(){if (tmp.h.mustbr) return '<br>'}
                ],
                "clickables",
                ["raw-html",
                function(){if (tmp.h.mustbr) return '<br>'}
                ],
                ["upgrades",[3,4]],
            ],
            shouldNotify(){
            return false
            },
            unlocked(){
            return hasUpgrade('he', 13)
            },
        },
    },
    upgrades: {
        11: {
            title: "hydrogen I",
            description: "unlock hydrogen effect",
            cost: new Decimal('10'),
        },
        12: {
            title: "hydrogen II",
            description: "every upgrades in this row except hydrogen I makes effect log base *0.99",
            cost: new Decimal('30'),
            effect(){
                let mult = decimalOne
                let mult1 = new Decimal(0.99)
                mult1 = applyeffect('h',14,mult1)
                if(hasUpgrade('h',12)) mult = mult.times(mult1)
                if(hasUpgrade('h',13)) mult = mult.times(mult1)
                if(hasUpgrade('h',14)) mult = mult.times(mult1)
                if(hasUpgrade('h',15)) mult = mult.times(mult1)
                return mult
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + 'x' }, // Add formatting to the effect
            unlocked() {
                return hasUpgrade('h', 11)
            },
        },
        13: {
            title: "hydrogen III",
            description: "every upgrades in this row mult hydrogen*1.5",
            cost: new Decimal('50'),
            effect(){
                let mult = decimalOne
                let mult1 = new Decimal(1.5)
                mult1 = applyeffect('h',15,mult1)
                if(hasUpgrade('h',11)) mult = mult.times(mult1)
                if(hasUpgrade('h',12)) mult = mult.times(mult1)
                if(hasUpgrade('h',13)) mult = mult.times(mult1)
                if(hasUpgrade('h',14)) mult = mult.times(mult1)
                if(hasUpgrade('h',15)) mult = mult.times(mult1)
                return mult
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + 'x' }, // Add formatting to the effect
            unlocked() {
                return hasUpgrade('h', 12)
            },
        },
        14: {
            title: "hydrogen IV",
            description: "improve hydrogen II",
            cost: new Decimal('100'),
            effect(){
                let mult = new Decimal(0.8)
                return mult
            },
            unlocked() {
                return hasUpgrade('h', 13)
            },
        },
        15: {
            title: "hydrogen V",
            description: "improve hydrogen III,unlock a buyable",
            cost: new Decimal('250'),
            effect(){
                let mult = new Decimal(1.2)
                return mult
            },
            unlocked() {
                return hasUpgrade('h', 14)
            },
        },
        21: {
            title: "hydrogen VI",
            description: "hydrogen point gives boost to hydrogen but less",
            cost: new Decimal('5000'),
            effect(){
                let exp = new Decimal(0.25)
                exp = applyeffect('h',24,exp)
                let mult = buyableEffect('h', 11).pow(exp)
                let start = new Decimal('1e30')
                mult = applysoftcap(start,0.33,mult)
                return mult
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + 'x' }, // Add formatting to the effect
            unlocked() {
                return hasUpgrade('h', 15)
            },
        },
        22: {
            title: "hydrogen VII",
            description: "hydrogen divide hydrogen log",
            cost: new Decimal('10000'),
            effect(){
                let mult = player.h.points.max(1).log(10).pow(0.03).max(1)
                return decimalOne.div(mult)
            },
            effectDisplay() {return '/' + format(decimalOne.div(upgradeEffect(this.layer, this.id)))}, // Add formatting to the effect
            unlocked() {
                return hasUpgrade('h', 21)
            },
        },
        23: {
            title: "hydrogen VIII",
            description: "hydrogen divide hydrogen point base",
            cost: new Decimal('30000'),
            effect(){
                let mult = player.h.points.max(1).log(13).pow(1.21).max(1)
                return decimalOne.div(mult.min(300))
            },
            effectDisplay() {return '/' + format(decimalOne.div(upgradeEffect(this.layer, this.id)))}, // Add formatting to the effect
            unlocked() {
                return hasUpgrade('h', 22)
            },
        },
        24: {
            title: "hydrogen IX",
            description: "improve hydrogen VI",
            cost: new Decimal('1000000'),
            effect(){
                return new Decimal(1.6)
            },
            unlocked() {
                return hasUpgrade('h', 23)
            },
        },
        25: {
            title: "hydrogen X",
            description: "unlock a new layer",
            cost: new Decimal('1e12'),
            unlocked() {
                return hasUpgrade('h', 24)
            },
        },
        31: {
            title: "stella I",
            description: "you can storage helium to your stella,unlock storaged stella effect",
            cost: new Decimal('1e21'),
            unlocked() {
                return hasUpgrade('he', 25)
            },
        },
        32: {
            title: "stella II",
            description: "storaged helium also gives an exponential effect to hydrogen",
            cost: new Decimal('1e24'),
            effect(){
                let eff = player.h.storagedhe.max(1).log(789113).pow(0.7312).pow(0.1234).times(1.1451419198101145141919810114514).max(1)
                if(eff.gte(5)) eff = eff.sub(5).max(1).log(10).max(1).log(10).max(1).log(10).max(1).log(10).add(5)
                return eff
            },
            effectDisplay() {return '^' + format(upgradeEffect(this.layer, this.id))}, // Add formatting to the effect
            unlocked() {
                return hasUpgrade('h', 31)
            },
        },
        33: {
            title: "stella III",
            description: "stella II also gives an exponential effect to hydrogen softcap start",
            cost: new Decimal('1e28'),
            effect(){
                let eff = upgradeEffect(this.layer, '32').times(0.9183).max(1)
                if(eff.gte(5)) eff = eff.sub(5).max(1).log(10).max(1).log(10).max(1).log(10).max(1).log(10).add(5)
                return eff
            },
            effectDisplay() {return '^' + format(upgradeEffect(this.layer, this.id))}, // Add formatting to the effect
            unlocked() {
                return hasUpgrade('h', 32)
            },
        },
        34: {
            title: "stella IV",
            description: "stella size also decrease hydrogen point softcap",
            cost: new Decimal('1e29'),
            effect(){
                let mult = tmp.h.stellaseff.pow(0.33333333)
                mult = applyexpeffect('h',44,mult)
                mult = mult.max(1).min(1e15)
                return decimalOne.div(mult)
            },
            effectDisplay() {return '/' + format(decimalOne.div(upgradeEffect(this.layer, this.id)))}, // Add formatting to the effect
            unlocked() {
                return hasUpgrade('h', 33)
            },
        },
        35: {
            title: "stella V",
            description: "you storage 100% your helium gain to your stella,improve 1th hydrogen in your stella effect,disable storage helium button",
            cost: new Decimal('5e29'),
            effect(){
                return new Decimal(1.5)
            },
            unlocked() {
                return hasUpgrade('h', 34)
            },
        },
        41: {
            title: "stella VI",
            description: "raise stella effect,storaged hydrogen effect,effect booster base to ^3",
            cost: new Decimal('1.00e31'),
            effect(){
                return new Decimal(3)
            },
            unlocked() {
                return hasUpgrade('h', 35)
            },
        },
        42: {
            title: "stella VII",
            description: "auto buy hydrogen point,remove hydrogen softcap",
            cost: new Decimal('2e46'),
            unlocked() {
                return hasUpgrade('h', 41)
            },
        },
        43: {
            title: "stella VIII",
            description: "effect booster also boost hygrogen point base and helium",
            cost: new Decimal('1e210'),
            effect(){
                return tmp.he.buyables[11].effect
            },
            unlocked() {
                return hasUpgrade('h', 42)
            },
        },
        44: {
            title: "stella IX",
            description: "stella II and stella III also gives an exponential boost to points and stella IV",
            cost: new Decimal('1e292'),
            effect(){
                let eff = decimalOne
                eff = applyeffect('h',32,eff)
                eff = applyeffect('h',33,eff)
                eff = applyeffect('h',45,eff)
                if(eff.gte(5)) eff = eff.sub(5).max(1).log(10).max(1).log(10).add(5)
                return eff
            },
            effectDisplay() {return '^' + format(upgradeEffect(this.layer, this.id))}, // Add formatting to the effect
            unlocked() {
                return hasUpgrade('h', 43)
            },
        },
        45: {
            title: "stella X",
            description: "stella IX also gives an exponential boost to hydrogen point softcap start,2x effect,hydrogen softcap is weak,unlock more helium upgrades",
            cost: new Decimal('1.5e310'),
            effect(){
                let eff = new Decimal(2)
                return eff
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id)) + 'x'}, // Add formatting to the effect
            unlocked() {
                return hasUpgrade('h', 44)
            },
        },
    },
    buyables: {
        11: {
            title: "hydrogen point",
            unlocked() {
                return hasUpgrade('h', 15)
            },
            base(){
                let base = new Decimal(300)
                base = applyeffect('h',23,base)
                return base
            },
            cost(x) {
                return this.base().times(new Decimal(1.3).pow(x.times(8))).times(new Decimal(1.01).pow(x.sub(4000).max(0).pow(2)))
            },
            display() {
                return format(layers[this.layer].buyables[this.id].effect(1)) + "x points" + "<br>Amount: " + formatWhole(getBuyableAmount(this.layer, this.id)) + "<br>Currently: " + format(buyableEffect(this.layer, this.id)) + 'x' + ((buyableEffect(this.layer, this.id).gte(1e70))?' (softcapped)':'') + "<br>Cost: " + format(tmp[this.layer].buyables[this.id].cost) + " hydrogen"
            },
            canAfford() {
                let can = player[this.layer].points.gte(this.cost())
                return can
            },
            buy() {
                let cost = new Decimal (1)
                player[this.layer].points = player[this.layer].points.sub(this.cost().mul(cost))
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {
                if(hasUpgrade('h', 42)){
                    let base = tmp[this.layer].buyables[this.id].base
                    let exp = 1.3
                    let scale = new Decimal(8)
                    let amount = player.h.points.div(base).max(1).log(exp).div(scale).ceil()
                    if(amount.gte(4000)){
                        let a = new Decimal(1.01).log(10)
                        let b = new Decimal(1.3).log(10).times(8)
                        let c = tmp[this.layer].buyables[this.id].base.log(10).add(new Decimal(1.3).log(10).times(32000)).sub(player.h.points.log(10))
                        let delta = b.pow(2).sub(a.times(c.times(4)))
                        let n = b.neg().add(delta.pow(0.5)).div(a.times(2)).ceil()
                        amount = n.add(4000)
                    }
                    setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).max(amount))
                }
            },
            effect(x) {
                let everyeff = player.h.points.pow(0.237).max(1)
                everyeff = applyeffect('h',43,everyeff)
                let start = new Decimal('1e70')
                if(hasUpgrade('h', 45))start = applyexpeffect('h',44,start)
                let eff = everyeff.pow(x)
                let log = new Decimal(8)
                log = applyeffect('h',34,log)
                let dilate = new Decimal(0.25)
                if(hasUpgrade('li', 13)) dilate = new Decimal(0.35)
                if(!hasUpgrade('he', 33))eff = applylogsoftcap('1e70', log.add(1), eff)
                start = new Decimal ('1e70')
                start = applyexpeffect('he',34,eff)
                start = applyexpeffect('li',11,eff)
                eff = applydilatesoftcap(start, dilate, eff)
                return eff.max(1)
            },
        },
    },
    clickables: {
        11: {
            display() {
                return 'storage all your hydrogen to stella'
            },
            canClick() {return !hasUpgrade('he', 24)},
            onClick() {
                if(!hasUpgrade('he', 24)){
                    player.h.storagedh = player.h.storagedh.add(player.h.points)
                    player.h.points = decimalZero
                }
            },
            unlocked() {return hasUpgrade("he",13) && !hasUpgrade('he', 24)},
        },
        12: {
            display() {
                return 'lose 1.22% of hydrogen in your stella per second but storaged hydrogen boost helium' + ((player.h.isloseh)?('<br>Currently: ' + format(tmp.h.shboost) + 'x'):'')
            },
            canClick() {return player.h.storagedh.gte(1)},
            onClick() {
                player.h.isloseh = !player.h.isloseh
            },
            unlocked() {return hasUpgrade("he",13)&&(!hasUpgrade('he', 25))},
        },
        13: {
            display() {
                return 'storage all your helium to stella'
            },
            canClick() {return !hasUpgrade('h', 35)},
            onClick() {
                if(!hasUpgrade('h', 35)){
                    player.h.storagedhe = player.h.storagedhe.add(player.he.points)
                    player.he.points = decimalZero
                }
            },
            unlocked() {return hasUpgrade("h",31) && !hasUpgrade('h', 35)},
        },
    },
    update(diff){
    if(player.h.isloseh&&(player.h.storagedh.gte(1))) player.h.storagedh = player.h.storagedh.times(new Decimal(0.99).pow(new Decimal(20/diff).min(1)))
    if(player.h.isloseh&&(player.h.storagedh.lt(1))||(hasUpgrade('he', 25)&&player.h.isloseh)) player.h.isloseh = false
    if(hasUpgrade('he', 24)) player.h.storagedh = player.h.storagedh.add(tmp.h.resetGain.times(diff))
    if(hasUpgrade('h', 35)) player.h.storagedhe = player.h.storagedhe.add(tmp.he.resetGain.times(diff))
    tmp.h.buyables[11].buyMax()
    },
    passiveGeneration: new Decimal(1),
    layerShown(){return true}
})
