import Ember from 'ember';
import { componentNodes } from 'liquid-fire/ember-internals';
import $ from 'jquery';
import AnimatedElement from '../animated-element';

export default Ember.Component.extend({
  tagName: '',
  didInsertElement() {
    this._forEachElement(elt => {
      $(elt).css('visibility', 'hidden');
    });
    this.sendAction("entering", this);
  },
  willDestroyElement() {
    this.sendAction("leaving", this);
  },

  _forEachElement(fn) {
    let { firstNode, lastNode } = componentNodes(this);
    let node = firstNode;
    while (node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        fn(node);
      } else if (! /^\s*$/.test(node.textContent)) {
        console.warn("Found bare text content inside a liquid-each");
      }
      if (node === lastNode){ break; }
      node = node.nextSibling;
    }
  },

  animatedElements() {
    let list = [];
    this._forEachElement(elt => {
      list.push(new AnimatedElement(elt));
    });
    return list;
  }
});
