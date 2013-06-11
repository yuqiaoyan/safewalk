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

function init(){
	console.log("+data processing");
	initData("data/data_2.txt");
	console.log("-data processing");

}

jQuery(document).ready(function($) {
	init();
});

