// Search Item View
// ================

// This is a subview for the search list view, where we create the individual list items for the list.
app.FoodItemView = Backbone.View.extend({
  tagName: 'li',
  className: 'list-group-item',
  template: _.template($('#food-item-template').html()),
  events: {
    // Clicking the 'x' will remove the item.
    'click .remove': 'removeItem'
  },
  initialize: function() {
    // Throw an error if no model is provided.
    if (!this.model) {
      throw new Error('You must provide a FoodItemModel to instantiate the view.');
    }
  },
  // We process the template and save our html in the el property for later consumption by the dayView's render function.
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
  // A method for removing items from that days list of food items.
  removeItem: function() {
    app.dayView.collection.remove(this.model);
  }
});
