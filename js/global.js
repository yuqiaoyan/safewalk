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
	initData("data/data_2.txt");

}

jQuery(document).ready(function($) {
	init();
});

