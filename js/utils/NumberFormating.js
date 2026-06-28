function exponentialFormat(num, precision, mantissa = true) {
    let e = num.log10().floor()
    let m = num.div(Decimal.pow(10, e))
    if (m.toStringWithDecimalPlaces(precision) == 10) {
        m = decimalOne
        e = e.add(1)
    }
    e = (e.gte(1e15) ? format(e, 2) : (e.gte(1000) ? commaFormat(e, 0) : e.toStringWithDecimalPlaces(0)))
    if (mantissa)
        return m.toStringWithDecimalPlaces(precision) + "e" + e
    else return "e" + e
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.001) return (0).toFixed(precision)
    let init = num.toStringWithDecimalPlaces(precision)
    let portions = init.split(".")
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    if (portions.length == 1) return portions[0]
    return portions[0] + "." + portions[1]
}


function regularFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.0001) return (0).toFixed(precision)
    if (num.mag < 0.1 && precision !==0) precision = Math.max(precision, 4)
    return num.toStringWithDecimalPlaces(precision)
}

function fixValue(x, y = 0) {
    return x || new Decimal(y)
}

function sumValues(x) {
    x = Object.values(x)
    if (!x[0]) return decimalZero
    return x.reduce((a, b) => Decimal.add(a, b))
}

function slog(n){ // slog10(x), .slog is bugged >=eee9e15
	n = new Decimal(n)
	return Decimal.add(n.layer,new Decimal(n.mag).slog())
}

function format(decimal, precision = 2, small) {
    //small = small || modInfo.allowSmall
    decimal = new Decimal(decimal)
    if (isNaN(decimal.sign) || isNaN(decimal.layer) || isNaN(decimal.mag)) {
        player.hasNaN = true;
        return "NaN"
    }
    if (decimal.sign < 0) return "-" + format(decimal.neg(), precision, small)
    if (decimal.mag == Number.POSITIVE_INFINITY) return "Infinity"
    if (decimal.gte("eeeeee15")) {
        var slg = slog(decimal)
        if (slg.gte(1e9)) return "F" + format(slg.floor())
        else return Decimal.pow(10, slg.sub(slg.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slg.floor(), 0)
    }
    else if (decimal.gte("1e1000000000")) return exponentialFormat(decimal, 0, false)
    else if (decimal.gte(1e9)) return exponentialFormat(decimal, precision)
    else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
    else if (decimal.gte(1)) return regularFormat(decimal, precision)
    else if (decimal.gt(0) && small)return '1/' + format(decimal.pow('-1'), precision)
    else if (decimal.gt(0))return regularFormat(decimal, precision)
    else if (decimal.eq(0)) return (0).toFixed(precision)

    decimal = invertOOM(decimal)
    let val = ""
    if (decimal.lt("1e1000")){
        val = exponentialFormat(decimal, precision)
        return val.replace(/([^(?:e|F)]*)$/, '-$1')
    }

}

function formatWhole(decimal) {
    decimal = new Decimal(decimal)
    if (decimal.gte(1e9)) return format(decimal, 2)
    if (decimal.lte(0.99) && !decimal.eq(0)) return format(decimal, 2)
    return format(decimal, 0)
}

function formatTime(s) {
    if (s < 60) return format(s) + "s"
    else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(s % 60) + "s"
    else if (s < 86400) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else if (s < 31536000) return formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else return formatWhole(Math.floor(s / 31536000)) + "y " + formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
}

function toPlaces(x, precision, maxAccepted) {
    x = new Decimal(x)
    let result = x.toStringWithDecimalPlaces(precision)
    if (new Decimal(result).gte(maxAccepted)) {
        result = new Decimal(maxAccepted - Math.pow(0.1, precision)).toStringWithDecimalPlaces(precision)
    }
    return result
}

function slogadd(n,add){
	n = new Decimal(n)
	return Decimal.tetrate(10,n.slog().add(add))
}

function verseShort(x) {
	s = new Decimal(x).slog().sub(Decimal.log10(9))
	let verse1 = [2,3,4,5]
	let verse2 = ["mlt","met","xen","hyp"]
	let id = 0;
		if (s.gte(verse1[verse1.length - 1])) id = verse1.length - 1;
		else {
			while (s.gte(verse1[id])) id++;
			if (id > 0) id--;
		}
	let mag = slogadd(x,-verse1[id]+1).div(1e9)
	return [mag,verse2[id]]
}

function distShort(s) {
	s = new Decimal(s)
	let uni = s.div(8.8e26)
	let mlt = verseShort(uni)
	let arv1 = [1,1e15,1e30,1e45,1e60,1e75,1e90,1e105,1e120,1e135]
	let arv2 = ["","mg","gg","tr","pt","ex","zt","yt","rn","qt"]
	let arv = 0;
		if (mlt[0].gte(arv1[arv1.length - 1])) arv = arv1.length - 1;
		else {
			while (mlt[0].gte(arv1[arv])) arv++;
			if (arv > 0) arv--;
		}
	let mverse = arv2[arv]+(arv2[arv]!=""?"-":"")+mlt[1]
	if (mlt[1]=="mlt") {
		mverse = arv2[arv]+"v"
		if (arv2[arv]=="") mverse = "mlt"
	}
	if (uni.gte("6pt9")) return format(slog(uni).pow10().div(9e6)) + " omni"
	if (uni.gte("ee9")) return format(mlt[0].div(arv1[arv])) + " " + mverse
	let scale1 = [1.616255e-35,1e-30,1e-27,1e-24,1e-21,1e-18,1e-15,1e-12,1e-9,1e-6,0.001,0.01,1,1e3,1e6,1e9,1.495978707e11,9.46e15,8.8e26]
	let scale2 = [" PL"," qm"," rm"," ym"," zm"," am"," fm"
	," pm"," nm"," μm"," mm"," cm"," m"," km"
	," Mm", " Gm", " AU", " ly", " uni"]
	let id = 0;
		if (s.gte(scale1[scale1.length - 1])) id = scale1.length - 1;
		else {
			while (s.gte(scale1[id])) id++;
			if (id > 0) id--;
		}
	return format(s.div(scale1[id])) + scale2[id]
}

function simpledist(s){
	s = new Decimal(s)
	let uni = s.div(8.8e26)
	let mlt = verseShort(uni)
	let arv1 = [1,1e15,1e30,1e45,1e60,1e75,1e90,1e105]
	let arv2 = ["","mg","gg","tr","pt","ex","zt","yt"]
	let arv = 0;
		if (mlt[0].gte(arv1[arv1.length - 1])) arv = arv1.length - 1;
		else {
			while (mlt[0].gte(arv1[arv])) arv++;
			if (arv > 0) arv--;
		}
	let mverse = arv2[arv]+(arv2[arv]!=""?"-":"")+mlt[1]
	if (mlt[1]=="mlt") {
		mverse = arv2[arv]+"v"
		if (arv2[arv]=="") mverse = "mlt"
	}
	if (uni.gte("6pt9")) return format(slog(uni).pow10().div(9e6)) + " omni"
	if (uni.gte("ee9")) return format(mlt[0].div(arv1[arv])) + " " + mverse
	let scale1 = [0.01,1,1e3,1e6,1e9,1.495978707e11,9.46e15,8.8e26]
	let scale2 = [" cm"," m"," km"," Mm", " Gm", " AU", " ly", " uni"]
	let id = 0;
	if (s.gte(scale1[scale1.length - 1])) id = scale1.length - 1;
	else {
		while (s.gte(scale1[id])) id++;
		if (id > 0) id--;
	}
	if(s.lt(1)) return formatSmall(s.div(scale1[id])) + scale2[id]
	return format(s.div(scale1[id])) + scale2[id]
}

// Will also display very small numbers
function formatSmall(x, precision=2) { 
    return format(x, precision, true)    
}

function invertOOM(x){
    let e = x.log10().ceil()
    let m = x.div(Decimal.pow(10, e))
    e = e.neg()
    x = new Decimal(10).pow(e).times(m)

    return x
}