// https://github.com/ahmadsoe/ember-highcharts/blob/master/tests/dummy/app/components/chart-highstock-interactive.js
import Ember from 'ember';
import stockData from '../../charts/data/stock';

const { inject, computed } = Ember;

export default Ember.Component.extend({

  chart: inject.service(),
  dynamicChart: inject.service(),

  chartOptions: {
    rangeSelector: {
      selected: 1
    },
    title: {
      text: 'Highstock: AAPL Stock Price'
    }
  },

  chartData: computed('chart.numSeries', function() {
    let numSeries = this.get('chart.numSeries');
    return this.get('dynamicChart').updateSeriesCount(stockData, numSeries);
  })

});
