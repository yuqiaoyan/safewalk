function user(){
	console.log("+user")

	//GLOBAL PRIVATE VARIABLES
	var lat = null;
	var lon = null;

	this.initialize = initialize;
	this.getLat = getLat;
	this.getLon = getLon;
	this.setLocation = setLocation;
	
	function getLat(){
		console.log("+getLat");
		return lat;
	}

	function getLon(){
		console.log("+getLon");
		return lon;
	}


	function setLocation(){
	//sets user lat and lon based on their current location

		var userLocation = function(pos) {
			// "this" is the instance of the function itself i believe
			console.log("------ geolocate success ------");
			lat = pos.coords.latitude;
			lon = pos.coords.longitude;
			console.log("lat: " + getLat());
			console.log("long: " + getLon());
			geocoder = new google.maps.Geocoder();
			findAddress(lat, lon);
		};

		/**
		 * Error if your location is not found
		 * @param  {object} error error object
		 */
		var e = function(error) {
			if (error.code === 1) {
				alert('Unable to get location');
			}
		}
		navigator.geolocation.getCurrentPosition(userLocation, e);
	}


	function initialize(){
		console.log("+initialize")
	
		setLocation();
		console.log("-initialize")
	}
	console.log("-user")

}

//initialize a new global user object

aUser = new user();
aUser.initialize();

/* google-map related globals */

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var infowindow;
var map;
var routes;
var routeResponse;
var routeCrimePts = [];
var markersArray = [];
var clusterArray = [];
var hasMapInit = false;
var geoCode;
var lat = 37.7750;
var lng = -122.4183;

/* end google-map related globals */

var debug = false;

/* main-js globals */

var currentRouteNum = -1;
var loaded = false;

/* crime.js globals */

var database = [];