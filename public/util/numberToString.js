import stache from "can-stache";

stache.registerConverter("numberToString",{
  get: function(source){
    return source() + "";
  },
  set: function(newVal, source){
    source(newVal === "" ? null : +newVal);
  }
});
