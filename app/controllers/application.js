import Ember from 'ember';
const { get, set } = Ember;

export default Ember.Controller.extend({
  placeholder1: 'placeholder-1',
  placeholder2: 'placeholder-2',

  actions: {
    toggleQuotes() {
      if (get(this, 'placeholder1')) {
        set(this, 'placeholder1', null);
        set(this, 'placeholder2', null);
      } else {
        set(this, 'placeholder1', 'placeholder-1');
        set(this, 'placeholder2', 'placeholder-2');
      }
    }
  }
});
