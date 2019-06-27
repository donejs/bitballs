import { Component, StacheDefineElement } from 'can';
import './create.less';
import view from './create.stache';

class StatCreate extends StacheDefineElement {
    static view = `hello world`;
    static define = {};
}

customElements.define("my-stat-create",StatCreate);

export default Component.extend({
  tag: 'stat-create',
  view,
  ViewModel: {
    // EXTERNAL STATEFUL PROPERTIES
    // These properties are passed from another component. Example:
    // value: {type: "number"}

    // INTERNAL STATEFUL PROPERTIES
    // These properties are owned by this component.
    message: { default: "This is the stat-create component" },

    // DERIVED PROPERTIES
    // These properties combine other property values. Example:
    // get valueAndMessage(){ return this.value + this.message; }

    // METHODS
    // Functions that can be called by the view. Example:
    // incrementValue() { this.value++; }

    // SIDE EFFECTS
    // The following is a good place to perform changes to the DOM
    // or do things that don't fit in to one of the areas above.
    connectedCallback(element){

    }
  }
});
