import domEvents from "can-dom-events";
import domMutateDomEvents from "can-dom-mutate/dom-events";

domEvents.addEvent(domMutateDomEvents.inserted);
domEvents.addEvent(domMutateDomEvents.removed);
