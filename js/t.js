addLayer("t", {
    name: "test", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData(){return{unlocked: true,}},
    color: "#FFFFFF",
    requires: new Decimal(0), // Can be a function that takes requirement increases into account
    resource: "test", // Name of prestige currency
    baseResource: "test", // Name of resource prestige is based on
    baseAmount() {return decimalZero}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0, // Prestige currency exponent
    row: "side", // Row the layer is in on the tree (0 is the first row)
    tabFormat: {
        "Main": {
            content: [
            "clickables"
            ],
        },
    },
    tooltip(){
        return 'test'
    },
    clickables: {
        11: {
            display() {
                return 'clear all'
            },
            canClick:true,
            onClick() {
                player.points = decimalZero
                let ls = Object.keys(layers)
                for(id in ls){
                    let lr = ls[id]
                    if(!(tmp[lr].startData == undefined)){
                        let a = tmp[lr].startData()
                        a = Object.keys(a)
                        for(let i = 0;i<a.length;i++){
                            let num = player[lr][a[i]]
                            if(num instanceof Decimal) player[lr][a[i]] = decimalZero
                        }
                    }
                    if(!(tmp[lr].buyables == undefined)){
                        a = tmp[lr].buyables
                        a = Object.keys(a)
                        for(i = 0;i<a.length;i++){
                            let num = player[lr].buyables[a[i]]
                            if(num instanceof Decimal) player[lr].buyables[a[i]] = decimalZero
                        }
                    }
                }
            },
            unlocked:true,
        },
        21: {
            display() {
                return 'clear points'
            },
            canClick:true,
            onClick() {
                player.points = decimalZero
            },
            unlocked:true,
        },
        32: {
            display() {
                return 'clear h'
            },
            canClick:true,
            onClick() {
                let a = tmp.h.startData()
                a = Object.keys(a)
                for(let i = 0;i<a.length;i++){
                    let num = player.h[a[i]]
                    if(num instanceof Decimal) player.h[a[i]] = decimalZero
                }
                a = tmp.h.buyables
                a = Object.keys(a)
                for(i = 0;i<a.length;i++){
                    let num = player.h.buyables[a[i]]
                    if(num instanceof Decimal) player.h.buyables[a[i]] = decimalZero
                }
            },
            unlocked:true,
        },
        33: {
            display() {
                return 'clear he'
            },
            canClick:true,
            onClick() {
                let a = tmp.he.startData()
                a = Object.keys(a)
                for(let i = 0;i<a.length;i++){
                    let num = player.he[a[i]]
                    if(num instanceof Decimal) player.he[a[i]] = decimalZero
                }
                a = tmp.he.buyables
                a = Object.keys(a)
                for(i = 0;i<a.length;i++){
                    let num = player.he.buyables[a[i]]
                    if(num instanceof Decimal) player.he.buyables[a[i]] = decimalZero
                }
            },
            unlocked:true,
        },
    },
    layerShown(){return true}
})
