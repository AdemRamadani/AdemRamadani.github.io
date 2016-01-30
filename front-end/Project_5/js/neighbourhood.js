/*jshint bitwise: false*/ //Because bitwise operators are useful!

var map, //Google map variable
    initialLocations = [ //Hard coded locations
    	{
    		position: {lat: 43.647829, lng: -79.388813},
    		storeName: "PAI",
    		motto: "Excellent Thai food!",
    		phone: "+14169014724"
    	},
    	{
    		position: {lat: 43.645177, lng: -79.395640},
    		storeName: "SOMA Chocolatemaker",
    		motto: "Excellent chocolate!",
    		phone: "+14165997662"
    	},
    	{
    		position: {lat: 43.666426, lng: -79.404332},
    		storeName: "Greg's Ice Cream",
    		motto: "Excellent ice cream!",
    		phone: "+14169624734"
    	},
    	{
    		position: {lat: 43.646240, lng: -79.419583},
    		storeName: "BANG BANG ICE CREAM",
    		motto: "Excellent ice cream sandwiches!",
    		phone: "+16473481900"
    	},
    	{
    		position: {lat: 43.647632, lng: -79.392022},
    		storeName: "Ravi Soups",
    		motto: "Excellent soup!",
    		phone: "+14167697284"
    	},
    ],
    TRIGGER_WIDTH = 800,
    LEFT_ARROW = String.fromCharCode(8592),
    RIGHT_ARROW = String.fromCharCode(8594);

/*
 * Initializes Google Map. Since some of the knockout observables are
 * google.maps.* objects, we need to wait until this is called before
 * calling ko.applyBindings().
 */
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 43.655, lng: -79.405},
		scrollwheel: false
	});

	ko.applyBindings(new ViewModel());
}

/*
 * Represents a Toronto location.
 */
var TorontoLocation = function(data) {
	this.position = ko.observable(data.position);
	this.storeName = ko.observable(data.storeName);
	this.motto = ko.observable(data.motto);
	this.phone = ko.observable(data.phone); //Used for Yelp lookup
};

/*
 * Adds a property of arbitrary type to a TorontoLocation object, and returns the object
 */
TorontoLocation.prototype.prop = function(key, value) {
	this[key] = ko.observable(value);
	return this;
};

/*
 * Returns true if the search strings are found at least one of the TorontoLocation's strings
 */
TorontoLocation.prototype.contains = function(searchString) {
	var searchArray = searchString.split(" "), s, i,
	    storeName = this.storeName().toLowerCase(),
	    motto = this.motto().toLowerCase();
	for (i = searchArray.length - 1; i >= 0; i--) {
		s = searchArray[i].toLowerCase();
		//Return false if any searched word is not present in either the name or motto
		if (!~storeName.indexOf(s) && !~motto.indexOf(s))
			return false;
	}
	return true;
};

/*
 * Our ViewModel object!
 */
var ViewModel = function() {
	var self = this, //Workaround...
	    loc,
	    pos = initialLocations[0].position,
	    bounds = {
	    	east: pos.lng,
	    	north: pos.lat,
	    	south: pos.lat,
	    	west: pos.lng
	    },
	    width = $(window).width();

	self.locationList = ko.observableArray([]); //List of TorontoLocations
	self.searchString = ko.observable(); //Search string, via user

	self.listInvisible = ko.observable(width < TRIGGER_WIDTH ? true : false); //Whether or not list is invisible
	self.hideButtonArrow = ko.observable(width < TRIGGER_WIDTH ? RIGHT_ARROW : LEFT_ARROW);

	//When searchString changes, update list and map markers accordingly.
	self.searchString.subscribe(function(s){
		self.locationList().forEach(function(loc){
			loc.visible(loc.contains(s));
		});
	});

	//Populate locationsList with hardcoded locations
	initialLocations.forEach(function(locationItem) {
		self.locationList.push( //Add location to locationList
			loc = new TorontoLocation(locationItem)
			.prop("marker", new google.maps.Marker({ //Add Google Maps Marker
				position: locationItem.position,
				map: map
			}))
			.prop("infoWindow", new google.maps.InfoWindow({ //Add Google Maps InfoWindow
				content: '<h1>' + locationItem.storeName + '</h1>' +
					'<p>' + locationItem.motto + '</p>'
			}))
			.prop("visible", true) //Add visible property (boolean)
			.prop("selected", false) //Add selected property (for use in list)
		);

		//On marker click, open InfoWindow
		loc.marker().addListener("click", (function(loc){
			return function() {
				self.openInfoWindow(loc);
			};
		})(loc));

		//On infoWindow closeclick, close infoWindow
		loc.infoWindow().addListener("closeclick", (function(loc) {
			return function() {
				self.closeInfoWindow(loc);
			};
		})(loc));

		//When visible property changes...
		loc.visible.subscribe((function(loc){
			return function() {
				var vis = loc.visible();
				loc.marker().setVisible(vis); //Set marker's visible property to match
				if (!vis) { //If this item should be invisible...
					loc.infoWindow().close(); //Close InfoWindow if it's open
					loc.selected(false); //Deselect item in list
				}
			};
		})(loc));

		//Calculate new map bounds to accomodate this location
		pos = loc.position();
		bounds.east = Math.max(bounds.east, pos.lng);
		bounds.west = Math.min(bounds.west, pos.lng);
		bounds.north = Math.max(bounds.north, pos.lat);
		bounds.south = Math.min(bounds.south, pos.lat);
	});
	map.fitBounds(bounds);

	/*
	 * Toggles list visibility
	 */
	self.hideShowList = function() {
		var vis = self.listInvisible();
		self.listInvisible(!vis);
		self.hideButtonArrow(vis ? LEFT_ARROW : RIGHT_ARROW);
		$(".hide-button").blur(); //Unfocus button (to prevent ugly border from appearing)
	};

	/*
	 * Hides list
	 */
	self.hideList = function() {
		self.listInvisible(true);
		self.hideButtonArrow(RIGHT_ARROW);
		// $(".hide-button").blur(); //Unfocus button (to prevent ugly border from appearing)
	};

	/*
	 * Opens an InfoWindow, closes others that may be open already
	 */
	self.openInfoWindow = function(loc) {
		//First close other infoWindows
		self.locationList().forEach(function(loc){
			self.closeInfoWindow(loc);
		});

		loc.infoWindow().open(map, loc.marker()); //Open infoWindow
		loc.selected(true); //Select item in list
		if(!loc.yelp) { //If Yelp AJAX request hasn't gone out yet...
			self.yelpMe(loc);
		}
		loc.marker().setAnimation(google.maps.Animation.BOUNCE); //Bounce pin

		if ($(window).width() < TRIGGER_WIDTH)
			self.hideList();

		map.panTo(loc.marker().getPosition());
	};

	/*
	 * Closes an info window, along with deselecting the item on the list and ceasing animation
	 */
	self.closeInfoWindow = function(loc) {
		loc.infoWindow().close(); //Close info window
		loc.marker().setAnimation(null); //Stop bouncing
		loc.selected(false); //Deselect item in list
	};

	/*
	 * Loads Yelp data and appends it to infoWindow content
	 */
	self.yelpMe = function(loc) {
		$.ajax(self.yelpSettings(loc));
		loc.prop("yelp",true);
	};

	/*
	 * Deals with OAuth and returns settings object for Yelp AJAX request
	 */
	self.yelpSettings = function(loc) {
		var yelp_url = "https://api.yelp.com/v2/phone_search/",
			parameters = {
				oauth_consumer_key: "YELP CONSUMER KEY",
				oauth_token: "YELP TOKEN",
				oauth_nonce: "Greetings",
				oauth_timestamp: Math.floor(Date.now()/1000),
				oauth_signature_method: 'HMAC-SHA1',
				oauth_version : '1.0',
				callback: 'cb',
				phone: loc.phone()
			},
			settings = {
				url: yelp_url,
				data: parameters,
				cache: true,
				dataType: 'jsonp',
				success: function(results) {
					var infoWindow = loc.infoWindow(), business = results.businesses[0];
					infoWindow.setContent(infoWindow.getContent() +
						'<a href="' + business.url + '">' +
							'<img src="img/yelp-logo-small.png">' +
							'<p>' +
								'<img src="' + business.rating_img_url + '"><br>' +
								'Based on ' + business.review_count + ' reviews' +
							'</p>' +
						'</a>');
				},
				error: function() {
					var infoWindow = loc.infoWindow();
					infoWindow.setContent(infoWindow.getContent() +
						'<img src="img/yelp-logo-small.png">' +
						'<p>' +
							'Yelp functionality is disabled!<br>' +
							'To enable, fork this repository and enter your own credentials' +
							'into the appropriate spots in this function.<br>' +
							'<a href="http://yelp.ca">Click here to go to Yelp.ca</a>' +
						'</p>');
				}
			};
		parameters.oauth_signature = oauthSignature.generate('GET',yelp_url, parameters, "YELP CONSUMER SECRET", "YELP TOKEN SECRET");
		return settings;
	};
};
