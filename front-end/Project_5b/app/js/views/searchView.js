/**
 * Search View
 *
 * Display the items returned by the Nutritionix API on every search query and
 * provide autocomplete functionality for the search field.
 *
 * @constructor
 */
app.SearchView = Backbone.View.extend({
  el: '#search-view',
  events: {
    'keyup #search-bar': 'handleKeyInput',
    'click .remove': 'clearSearch'
  },
  /**
   * We need to instantiate the collections for the autocomplete functionality
   * as well as the search results.
   */
  initialize: function() {
    this.collection = new app.SearchResultsCollection();
    this.autocompleteCollection = new app.AutocompleteCollection();

    // The collection is reset on every search.
    this.listenTo(this.collection, 'reset', this.render);
    this.listenTo(this.collection, 'error', function(collection, resp) {
      this.renderError(resp.status, resp.statusText);
    });
    this.results = $('#search-results');
  },
  /**
   * We call the render method every time we get search results back from the API
   * and the collection has reset.
   */
  render: function() {
    var self = this;
    // Each item in the collection is rendered in a subview.
    // TODO: use map instead?
    // var views = this.collection.map(function(model) {
    //   return new app.SearchItemView({
    //     model: model
    //   }).render().el;
    // });
    // document.getElementById('search-results').appendChild(create(views));
    // this.$('.loading').slideUp.call(this, function() {
    //   this.results.html(views.join()).slideDown();
    // });
    var subviews = [];
    this.collection.each(function(model) {
      subviews.push(new app.SearchItemView({
        model: model
      }));
    });
    // We create a document fragment to not reflow the page for every model.
    var container = document.createDocumentFragment();
    // Append our subviews to the container.
    _.each(subviews, function(subview) {
      container.appendChild(subview.render().el);
    });
    // Before appending the results we need to remove the loading indicator.
    this.$('.loading').slideUp(400, function() {
      self.results.append(container).slideDown();
    });
  },
  /**
   * We only request a search if the user presses enter, otherwise we try to
   * autocomplete the query.
   * @param  {Object} event The event object
   */
  handleKeyInput: function(event) {
    var query = $('#search-bar').val().trim();
    if (!query) {
      this.clearSearch();
    } else if (event.keyCode === 13) {
      this.searchOnEnter(query);
    } else {
      this.autocomplete(query);
    }
  },
  /**
   * Whenever the user presses a key other than the enter key, we call the
   * Nutritionix Autocomplete API with the query.
   * @param {String} query The current value of the searchbar.
   */
  autocomplete: function(query) {
    this.autocompleteCollection.query = query;
    this.autocompleteCollection.fetch({
      reset: true
    });
  },
  /**
   * Whenever the user presses enter, we call the nutritionix API with the query.
   * @param {String} query The current value of the searchbar.
   */
  searchOnEnter: function(query) {
    this.clearSearch();
    this.renderStart();
    this.collection.query = query;
    this.collection.fetch();
  },
  /**
   * Method for emptying the search results and search field.
   */
  clearSearch: function() {
    var self = this;
    this.$('h3').slideUp();
    this.$('.error').slideUp();
    this.results.slideUp(function() {
      self.results.empty();
    });
    $('#search-bar').val('').focus();
  },
  /**
   * Shows the title and loading indicator whenever a search is rendered.
   */
  renderStart: function() {
    this.$('.loading').slideDown();
    this.$('h3').slideDown();
  },
  /**
   * If an error is returned from the API we show the user an error message.
   * @param  {Object} err The error response from the API call.
   */
  // TODO: Better error messages.
  renderError: function(status, msg) {
    var self = this;
    var errMsg = 'Statuscode ' + status + ': ' + msg;
    console.warn(errMsg);
    this.$('.loading').slideUp(400, function() {
      self.results.append(new app.SearchItemView({
        model: new Backbone.Model({
          error: errMsg
        })
      }).renderError().el).slideDown();
    });
  }
});
