/**
 * Autocomplete Collection
 *
 *
 *
 * @constructor
 */
app.AutocompleteCollection = Backbone.Collection.extend({
  query: '',
  url: 'https://apibeta.nutritionix.com/v2/autocomplete',
  sync: function() {
    var self = this;
    var params = {
      q: this.query,
      appId: '114d25dd',
      appKey: 'cd1b70e0dfa8bd768aa1a4e7c1e880d5'
    };
    var options = {
      type: 'GET',
      data: $.param(params),
      url: self.url,
      success: function(data) {
        if (false) {
          var msg = 'No results were returned for your search query.';
          self.trigger('error', msg);
          return;
        }
      },
      error: function(err) {
        self.trigger('error', err);
      }
    };
    return $.ajax(options);
  }
});
