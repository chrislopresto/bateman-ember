import Ember from 'ember';

const { inject } = Ember;

export default Ember.Component.extend({
  classNames: ['ChartSettings'],
  chart: inject.service(),

  actions: {
    setSeriesCount(numSeries) {
      this.set('chart.numSeries', numSeries);
    }
  }
});
