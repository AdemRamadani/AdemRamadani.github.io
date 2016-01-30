// Food Item Collection
// ====================

// A collection type for holding food items. We're using the firebase addon as our collection object.
app.DayCollection = Backbone.Firebase.Collection.extend({
  url: function() {
    var root = 'https://sizzling-torch-7921.firebaseio.com/tracker/';
    var id = app.currentId;
    return root + id;
  }
});
