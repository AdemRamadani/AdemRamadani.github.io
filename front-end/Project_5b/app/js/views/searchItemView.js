/**
 * Search Item View
 *
 * This is a subview for the search list view, where we create the individual
 * list items for the list.
 *
 * @constructor
 */
app.SearchItemView = Backbone.View.extend({
  tagName: 'li',
  className: 'list-group-item',
  template: _.template($('#search-item-template').html()),
  errorTemplate: _.template($('#search-item-error-template').html()),
  events: {
    // When an item in the list is clicked we start tracking it.
    'click': 'trackItem'
  },
  initialize: function() {
    // Throw an error if no model is provided.
    if (!this.model) {
      throw new Error('You must provide data to instantiate the view.');
    }
  },
  // We process the template and save our html in the el property for later
  // consumption by the searchListView's render function.
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
  // We process the template and save our html in the el property for later
  // consumption by the searchListView's renderError function.
  renderError: function() {
    this.$el.html(this.errorTemplate(this.model.toJSON()));
    return this;
  },
  /**
   * We add models to a days list by calling addItem on that days collection and
   * passing in a cloned model. If we don't clone the model we are only passing
   * in a pointer to the existing model, and so we can't add it more than once.
   * But the user may have had more than one Chockolate Fudge Super Cream
   * Brownie Chunky scoop of icecream that day, so we need to be able to add the
   * same food item many times.
   */
  // TODO: Move the logic of setting data into the collection, for a clear
  // seperation of concerns.
  trackItem: function(event) {
    event.preventDefault();
    // For Firebase to work we need to set the id property.
    var newModel = this.model.clone().set('id', +new Date());
    // Then we add the model to our collection.
    app.dayView.collection.add(newModel);
    // Clear the searchView as specified.
    app.searchView.clearSearch();
  }
});
