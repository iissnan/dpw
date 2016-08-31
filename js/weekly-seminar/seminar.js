(function (root) {
  root.seminar = function(selector) {
    return new Seminar({
      selector: selector,
      source: SEMINAR
    });
  };

  /**
   * Create Seminar.
   * @param {Object} settings
   * @param {String} settings.selector
   * @param {Object} settings.source
   * @constructor
   */
  function Seminar(settings) {
    this.$wrap = $(settings.selector);
    this.$map = this.$wrap.find('.weekly-seminar-map');
    this.$events = this.$wrap.find('.weekly-seminar-events');
    this.year = this.int(this.$wrap.data('year'));
    this.month = this.int(this.$wrap.data('month'));
    this.source = settings.source[this.year][this.month];
    this.init();
  }

  Seminar.prototype.init = function () {
    this.renderMap();
    this.renderEvents();
  };

  Seminar.prototype.renderMap = function () {
    var start = new Date(this.year, this.month - 1);
    var mapConfig = Object.assign({}, this.mapCommonConfigs, {
      itemSelector: this.$map[0],
      start: start,
      data: this.getMapItems(),
      highlight: this.getMapHighlights()
    });

    this.cal = new CalHeatMap();
    this.cal.init(mapConfig);
  };

  Seminar.prototype.mapCommonConfigs = {
    domain: 'month',
    subDomain: 'x_day',
    range: 1,
    cellSize: 25,
    cellPadding: 1,
    domainMargin: [5, 10],
    displayLegend: false,
    label: {
      position: 'left',
      rotate: 'left',
      align: 'center',
      width: 15,
      offset: {
        x: -70
      }
    },
    domainLabelFormat: "%Y - %m",
    subDomainTextFormat: "%d"
  };

  Seminar.prototype.renderEvents = function () {
    var html = [
      '<table>',
      '<thead>',
      '  <tr>',
      '    <th>Date</th>',
      '    <th>Presenter</th>',
      '    <th>Topic</th>',
      '  </tr>',
      '</thead>'
    ];

    html = html.concat(
      this.source.items.filter(function (item) {
        return item.topic;
      }).map(function (item) {
        return (
          '<tr>' +
          '  <td>' + item.date + '</td>' +
          '  <td>' + item.presenter + '</td>' +
          '  <td>' + item.topic + '</td>' +
          '</tr>'
        );
      })
    );
    html.push('</table>');

    this.$events.html(html.join(''));
  };

  /**
   * Get data for Cal-heatmap.
   * @see http://cal-heatmap.com/#data-format
   */
  Seminar.prototype.getMapItems = function () {
    var stats = {};

    this.source.items.filter(function (item) {
      return item.value;
    }).forEach(function (item) {
        var timestamp = formatDate(item.date);
        stats[timestamp] = item.value;
    });

    return stats;

    function formatDate(date) {
      return Date.parse(date).valueOf() / 1000;
    }
  };

  /**
   * Get highlight cells.
   * @see http://cal-heatmap.com/#highlight
   * @returns {Array}
   */
  Seminar.prototype.getMapHighlights = function () {
    return this.source.items.filter(function(item) {
      return item.value === 0;
    }).map(function (item) {
      return new Date(item.date);
    });
  };

  Seminar.prototype.int = function (value) {
    return parseInt(value, 10);
  };
}(window));
