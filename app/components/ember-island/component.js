import Ember from 'ember';
import EmberWormhole from 'ember-wormhole/components/ember-wormhole';

const { computed } = Ember;

export default EmberWormhole.extend({
  classNames: ['EmberIsland'],
  renderInPlace: computed.readOnly('archipelago.renderInPlace')
});
