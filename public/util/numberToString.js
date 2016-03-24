import can from "can";
import "can/view/stache/";

can.stache.registerHelper("numberToString", function(newVal, source){
	if(newVal instanceof can.expression.SetIdentifier) {
		source(newVal.value === "" ? null : +newVal.value);
	} else {
		source = newVal;
		return source() + "";
	}
});