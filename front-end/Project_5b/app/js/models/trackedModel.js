/**
 * Days Model
 *
 * A model for holding a list of tracked days.
 *
 * @constructor
 */

app.TrackedModel = Backbone.Firebase.Model.extend({
  url: new Firebase('https://sizzling-torch-7921.firebaseio.com/tracked'),
  defaults: {
    days: []
  },
  initialize: function() {
    var self = this;
    var ref = new Firebase('https://sizzling-torch-7921.firebaseio.com/tracker');
    ref.on('child_added', function(snapshot) {
      self.addDay(snapshot.key());
    });
    ref.on('child_removed', function(snapshot) {
      var key = snapshot.key();
      self.removeDay(key);
    });
  },
  addDay: function(obj) {
    this.get('days').push(obj);
    this.save();
  },
  removeDay: function(key) {
    var _days = this.get('days');
    var index = _days.indexOf(key);
    _days.splice(index, 1);
    this.save({'days': _days});
  }
});

