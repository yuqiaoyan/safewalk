var SUPPORTED_CITIES = {"San Francisco":1};

function user(){
	console.log("+user")

	//GLOBAL PRIVATE VARIABLES
	var lat = null;
	var lng = null;
	var point = null;
	var city = null;
	var today = null;

	this.initialize = initialize;
	this.getLat = getLat;
	this.getLng = getLng;
	this.getPt = getPt;
	this.setLocation = setLocation;
	this.getToday = getToday; //from 0-6
	
	//------- GETTER FUNCTIONS -----------//
	function getLat(){
		return lat;
	}

	function getLng(){
		return lng;
	}

	function getPt(){
		return point;
	}

	function getToday(){
		var date = new Date();
		today = date.getDay(); 
		console.log("user date: ")
		console.log(today);
		return today
	}


	//------- SETTER FUNCTIONS -----------//
	function setLocation(){
	//sets user lat and lng based on their current location

		var userLocation = function(pos) {
			// "this" is the instance of the function itself i believe
			console.log("------ geolocate success ------");
			lat = parseFloat(pos.coords.latitude);
			lng = parseFloat(pos.coords.longitude);
			point = new google.maps.LatLng(lat, lng);
			console.log("lat: " + getLat());
			console.log("long: " + getLng());
			findAddress(lat, lng);
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


	//------- INITIALIZE -----------//
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
var geocoder = new google.maps.Geocoder();
var validRoute;
var geoCode;


/* end google-map related globals */

var debug = false;
var currentAddress;

/* main-js globals */

var currentRouteNum = -1;
var loaded = false;

/* crime.js globals */

var database = [];

/*map render globals */
var userMarker = null;
var isTracking = false;
