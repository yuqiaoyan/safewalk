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

/* end google-map related globals */

var debug = false;

function init(){
	console.log("+data processing");
	initData("data/data_2.txt");
	console.log("-data processing");

}

jQuery(document).ready(function($) {
	//console.log("Window URL: " + window.location.pathname);

	var debugValue = document.URL.split('debug=');
	
	if(debugValue.length > 1){
		debug = debugValue[1]; //set a debug value to print out useful information
	}

	init();

});

