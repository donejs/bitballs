/*
 * Fixes #49
 * Show placeholder text instead of 0s for number properties
 */
module.exports = function(prop){
	return {
		get: function(){
			var value = this.attr(prop);
			if(typeof value === "number") {
				return ""+value;
			} else {
				return "";
			}
		},
		set: function(newVal){
			var toNum = +newVal;
			if(toNum !== toNum){
				// NaN
				this.removeAttr(prop);
			} else {
				this.attr(prop, toNum);
			}
		}
	}
}