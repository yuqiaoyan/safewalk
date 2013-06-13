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