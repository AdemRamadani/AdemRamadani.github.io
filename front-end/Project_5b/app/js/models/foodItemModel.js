// Food Item Model
// ===============

// Holds data for the food items.

app.FoodItemModel = Backbone.Model.extend({
  // Validation is mostly for making sure we're not loading in some meaningless data, but will be useful if we decided to include the option to add/edit food items.
  validate: function(attrs) {
    // Make sure both the title and calories attributes are present.
    if (!attrs.title) {
      return 'Title is required.';
    }
    if (!attrs.calories) {
      return 'A calories attribute is required.';
    }
  }
});
