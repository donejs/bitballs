import stache from "can-stache";
import expression from "can-stache/src/expression";

stache.registerHelper("numberToString", function(newVal, source){
	if(newVal instanceof expression.SetIdentifier) {
		source(newVal.value === "" ? null : +newVal.value);
	} else {
		source = newVal;
		return source() + "";
	}
});