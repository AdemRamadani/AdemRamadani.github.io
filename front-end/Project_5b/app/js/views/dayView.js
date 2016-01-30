/**
 * Day View
 *
 * A view for displaying the list of food items for the selected date.
 *
 * @constructor
 */
app.DayView = Backbone.View.extend({
  el: '#day-view',
  initialize: function() {
    this.list = this.$('#food-list');

    this.collection = new app.DayCollection();
    // TODO: Listen to add and remove events.
    this.listenTo(this.collection, 'sync', this.renderStart);
    this.listenTo(this.collection, 'add', this.renderStart);
  },
  /**
   * Called when the tracked date changes, to clean up the UI before the
   * collection syncs up with firebase.
   */
  renderStart: function() {
    var self = this;
    this.renderDate();
    this.list.slideUp(200, function() {
      self.$('.loading').show();
      self.list.empty();
      self.render();
    });
  },
  /**
   * If the collection is empty we render help text on how to add food
   * items to the list. Otherwise each item in the collection is rendered in a
   * subview.
   *
   * @return {Object} The dayView object.
   */
  render: function() {
    // Appending to a document fragment avoids reflowing the page for every view.
    var container = document.createDocumentFragment();
    if (!this.collection.length) {
      $('<li/>', {
          'class': 'list-group-item list-empty',
          text: 'Use the search bar to search for a food item, and click on a search result to add it.'
        })
        .appendTo(container);
    } else {
      var _views = [];

      this.collection.each(function(model) {
        _views.push(new app.FoodItemView({
          model: model
        }));
      });

      _.each(_views, function(subview) {
        container.appendChild(subview.render().el);
      });
    }
    this.$('.loading').hide();
    this.list.append(container).slideDown();

    this.renderCalorieCount();

    return this;
  },
  /**
   * Calculate the calorie total for the food items in this.collection
   * and display it on the page.
   */
  renderCalorieCount: function() {
    var total = _.reduce(this.collection.models, function(memo, model) {
      return memo + model.get('calories');
    }, 0);
    this.$('#total-calories').html(total);
  },
  /**
   * The datestring for the display of the date in the UI.
   * @return {String} in the format 'DAY, MONTH MM, YYYY'
   */
  renderDate: function() {
    var date = new Date(app.currentId);
    var dateOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    this.$('#datepicker').html(date.toLocaleDateString('en-US', dateOptions));
  }
});
