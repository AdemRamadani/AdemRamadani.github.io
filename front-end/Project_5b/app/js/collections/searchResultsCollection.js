/**
 * Search Results Collection
 *
 * We convert the data directly into models on the collection. Search results
 * are held in the collection as food item models and are cloned if they are
 * added to that days food list. By cloning the model we can add multiple
 * instances of the same food item to that days list.
 *
 * @constructor
 */
app.SearchResultsCollection = Backbone.Collection.extend({
  // Placeholder for the users search query.
  query: '',
  // Which fields to return from the API and account authentication parameters.
  params: {
    fields: 'item_name,nf_calories',
    appId: '114d25dd',
    appKey: 'cd1b70e0dfa8bd768aa1a4e7c1e880d5'
  },
  /**
   * Base url for the api call.
   * @return {String} The url string.
   */
  url: function() {
    return 'https://api.nutritionix.com/v1_1/search/' + this.query;
  },
  /**
   * Overrides sync to create the correct url and deal with errors.
   * @param  {String} method  The method passed in from the fetch method.
   * @param  {Object} model   The collection (this).
   * @param  {Object} options Default options from the fetch method.
   * @return {Object}         Returns the response object from the ajax call.
   */
  sync: function(method, model, options) {
    options.url = this.url();
    options.data = $.param(this.params);
    Backbone.sync.call(this, method, model, options);
  },
  /**
   * Overrides parse to create the models from the response from the API. Also
   * needs to handle the error where no results were found.
   * @param {Object} resp The data from the API call.
   */
  parse: function(resp) {
    if (!resp.hits.length) {
      this.trigger('error', this, {
        'status': 200,
        'statusText': 'No results for this query'
      });
    } else {
      var collectionData = _.map(resp.hits, function(item) {
        return {
          /* jshint camelcase: false */
          nutritionixId: item._id,
          title: item.fields.item_name,
          calories: Math.round(item.fields.nf_calories)
        };
      });
      this.reset(collectionData);
    }
  }
});
