'use strict';
/* globals Backbone, Firebase, $, _, Pikaday */

// Create an app object for namespacing.
var app = {
  /**
   * init holds all the logic for getting the app up and running.
   */
  init: function() {
    // The ID of the currently displayed day.
    this.currentId = app.createIdString();

    this.tracked = new app.TrackedModel();
    this.searchView = new app.SearchView();
    this.dayView = new app.DayView();
    /**
     * Adds a calendar datepicker to the app.
     * @type {Object} a Pikaday object
     */
    this.picker = new Pikaday({
      field: document.getElementById('datepicker'),
      position: 'top left',
      // When a day is clicked in the calendar, we set the value of
      // app.currentId to that date.
      onSelect: function() {
        var value = app.picker.toString();
        app.currentId = app.createIdString(new Date(value));
        app.dayView.initialize();
      },
      /**
       * Every time a new month is displayed in the Pikaday datepicker it
       * triggers the onDraw event. We use this to identify which days, in the
       * month that is being drawn, are being tracked by the user, and give them
       * a selected state.
       */
      onDraw: function() {
        app.showTracked(this);
      }
    });
  },
  // Every tracked day needs to be selectable in the Pikaday datepicker.
  // So whenever the datepicker month changes or a new day is tracked, we go
  // through them all to show them to the user.
  showTracked: function(datePicker) {
    _.each(app.tracked.toJSON().days, function(day) {
      var date = day.split('-');
      var year = date[0] === datePicker.calendars[0].year.toString();
      var month = (date[1] - 1).toString() ===
        datePicker.calendars[0].month.toString();
      if (year && month) {
        $('td[data-day="' + parseInt(date[2]) + '"]').addClass('is-selected');
      }
    });
  },
  /**
   * We create a useful datestring that is used for data retrieval.
   * @param  {Object} a Date object.
   * @return {String} in the format 'YYYY-MM-DD'.
   */
  createIdString: function(pikaDate) {
    var date = pikaDate || new Date();
    // The datestrings..
    var day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    var month = date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    // return the completed id string in the format 'YYYY-MM-DD'.
    return [date.getFullYear(), month, day].join('-');
  }
};

$(function() {
  app.init();
  // TESTCODE - Uncomment this code to see what happens on a slow connection.
  // Change the search query to something like 'Fooooooooo' to see an error.
  app.searchView.collection.query = 'Banana';
  app.searchView.clearSearch();
  app.searchView.renderStart();
  window.setTimeout(function() {
    app.searchView.collection.fetch();
  }, 1500);
});
