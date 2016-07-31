import Ember from 'ember';

export default Ember.Controller.extend({
  placeholder1: 'placeholder-1',
  placeholder2: 'placeholder-2',

  actions: {
    toggleQuotes() {
      if (this.get('placeholder1')) {
        this.set('placeholder1', null);
        this.set('placeholder2', null);
      } else {
        this.set('placeholder1', 'placeholder-1');
        this.set('placeholder2', 'placeholder-2');
      }
    }
  }
});
