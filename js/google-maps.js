/**
 * Initializes Google Maps
 * @param  {double}   lat      Latitude in start input
 * @param  {double}   lng      Longitude in given city
 * @param  {Function} callback Call function after map loads
 */

function initMap(lat, lng, callback) {
	console.log("+google-maps initialize");

	var polyOption = {
		strokeColor: "red"
	}
	var renderOption = {
		polylineOptions: polyOption
	}
	directionsDisplay = new google.maps.DirectionsRenderer();


	var mapOptions = {
		zoom: 15,
		center: new google.maps.LatLng(lat, lng),
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP

	};

	map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);
	directionsDisplay.setMap(map);
	// createMark(lat,lng,"img/hippo.png");
	callback();
	console.log("-google-maps initialize");
}



/**
 * Convert feet to mile
 * @param  {double} distanceFt measurement in feet
 * @return {double}            measurement in miles
 */

function ftToMi(distanceFt) {
	return distanceFt / 1609.24;
}

/**
 * Calculate all routes infomation
 * @param  {string} start lat and lng of start location
 * @param  {string} end   lat and lng of destination
 */

function calcRoute(start, end) {
	console.log("+calcRoute");

	var request = {
		origin: start,
		destination: end,
		provideRouteAlternatives: true,
		travelMode: google.maps.DirectionsTravelMode.WALKING
	};

	directionsService.route(request, function(response, status) {
		clearOverlays();
		if (status == google.maps.DirectionsStatus.OK) {
			routeCrimePts = [];
			if(currentAddress == start){
				isTracking = true;
			}else{
				isTracking = false;
			}
			console.log("+running direction service+");
			if (validRoute) {
				$('.openOptions').removeClass('ui-disabled')
				for (var i = 0; i < response.routes.length; i++) {
					routeInfo(response, i)
				};
				getBestRoute(); //sorts routeCrimePts and 
				renderRoutes(routeCrimePts);
				resizeMap('#page2', $('.info').height()+$('.direction_button').height());
				updateMarkers(currentRouteNum);
			} else {
				renderRoutes(response.routes);
				resizeMap('#page2', $('.info').height()+$('.direction_button').height());
				$('.openOptions').addClass('ui-disabled')
				$(".errormsg").html("Sorry! We currently do not support this city. Our team of hippos are working hard on it");
				$("#popupError").popup("open")
				
			}
			$('.loading').css('display','none');
			console.log("-running direction service-");
			updateRouteRenderer(start, end, currentRouteNum);

			//temporarily placing it here
			// if(isTracking)
				// renderUser(); //render user marker
		} else {
			console.log("Unable to get directionService information");
		}
		//add error code

	});

	console.log("-calcRoute");

}

/**
 * Store all routes information
 * @param  {json} response of routes information
 * @param  {int} routeNum index of current route
 */

function routeInfo(response, routeNum) {
	console.log("RUN ROUTE!!!");
	var totalDistance = 0;

	var selectedLines = new Object;
	selectedLines.pathjb = [];
	selectedLines.pathkb = [];
	selectedLines.routeNum = routeNum;
	selectedLines.array = []; //array contains all crime data info with respect to day, time, and location
	selectedLines.last = 0;
	selectedLines.via;
	selectedLines.duration;
	selectedLines.durationValue;
	selectedLines.swap = function(curr) {
		var temp = selectedLines.array[selectedLines.last];
		selectedLines.array[selectedLines.last] = selectedLines.array[curr];
		selectedLines.array[curr] = temp;
		if (selectedLines.last > 0)
			selectedLines.last--;

	};
	selectedLines.totalCrimes;

	selectedLines.via = response.routes[routeNum].summary;
	// console.log(selectedLines.via);
	selectedLines.duration = response.routes[routeNum].legs[0].duration.text;
	selectedLines.durationValue = response.routes[routeNum].legs[0].duration.value;
	// console.log(selectedLines.via);
	// console.log(selectedLines.duration);


	// var routeNum = 0;
	var steps = response.routes[routeNum].legs[0].steps;

	for (var j = 0; j < steps.length; j++) {
		totalDistance += steps[j].distance.value;
	};

	//totalDistance = steps[steps.length-1].distance.value;

	var initialStepJB = steps[0].start_location.jb;
	var initialStepKB = steps[0].start_location.kb;
	var finalStepKB = steps[steps.length - 1].start_location.kb;
	var finalStepJB = steps[steps.length - 1].start_location.jb;

	var midJB = (initialStepJB + finalStepJB) / 2;
	var midKB = (initialStepKB + finalStepKB) / 2;
	var radiusMi = ftToMi(totalDistance);
	var nIndex = 0;


	function set_selectedLines(crime,index,array){
		// console.log("+set_selectedLines")
		// console.log("midJB",midJB)
		// console.log("midKB",midKB)
		// (37.8084763 ,-122.26881204999998)
		// var temp = haversine(47.62268,-122.3560459,47.60733158,-122.3386512,3.25)
		// console.log("crime", crime)
		// if(crime.Y == 47.60733158)
		//	debugger;
		if(haversine(midJB,midKB,crime.Y,crime.X,radiusMi)){
			selectedLines.array[nIndex++] = crime;
		}
	}

	database.forEach(set_selectedLines);

	// console.log("total selected lines " + selectedLines.array.length);
	selectedLines.last = selectedLines.array.length - 1;

	for (var i = 0; i < steps.length; i++) {
		updateCrimeCount(i, selectedLines);
	}

	function updateCrimeCount(num, selectedLines) {
		var radius = 0.05; //in mile
		for (var i = 0; i < steps[num].path.length; i++) {
			selectedLines.pathjb.push(steps[num].path[i].jb);
			selectedLines.pathkb.push(steps[num].path[i].kb);
			for (var j = 0; j < selectedLines.last; j++) {
				if (haversine(steps[num].path[i].jb, steps[num].path[i].kb, selectedLines.array[j].Y, selectedLines.array[j].X, radius)) {
					selectedLines.swap(j);
				}
			}
		}
		// console.log("total found " + selectedLines.length + " " + selectedLines.last);
	}
	selectedLines.totalCrimes = selectedLines.array.length - selectedLines.last - 1;
	console.log("total crimes is " + selectedLines.totalCrimes);

	routeCrimePts[routeNum] = selectedLines;
}

/**
 * Create marker
 * @param  {double} lat latitude
 * @param  {double} lng longitude
 * @return {object}     markerObject
 */

function createMark(lat, lng, icon) {
	if (icon) {
		var pinIcon = new google.maps.MarkerImage(
			icon,
			null, /* size is determined at runtime */
			null, /* origin is 0,0 */
			null, /* anchor is bottom center of the scaled image */
			new google.maps.Size(30, 20));

		var marker = new google.maps.Marker({
			map: map,
			position: new google.maps.LatLng(lat, lng),
			zIndex: 1,
			icon: pinIcon
		});
	} else {
		var marker = new google.maps.Marker({
			map: map,
			position: new google.maps.LatLng(lat, lng),
			zIndex: 1
		});
	}

	markersArray.push(marker);
	return marker;

}

function createInfoWindow(marker, number, i) {
	google.maps.event.addListener(marker, 'click', function() {
		if (infowindow) infowindow.close();
		infowindow = new google.maps.InfoWindow({
			content: generateInfo(routeCrimePts[number].array[i]),
			maxWidth: 310
		});

		infowindow.open(map, marker);
	});
}

function createPath(lat, lng) {
	console.log("+createPath");
	var marker = new google.maps.Marker({
		icon: "img/blue_MarkerA.png",
		map: map,
		position: new google.maps.LatLng(lat, lng),
		zIndex: 2
	});
	markersArray.push(marker);
	return marker;
	console.log("-createPath");

}

/**
 * Find locations within a given radius
 * @param  {double} nlat     latitude representing origin of circle
 * @param  {double} nlong    longitude representing origin of circle
 * @param  {double} mlat     latitude to check if within the radius
 * @param  {double} mlong    longitude to check if within the radius
 * @param  {double} distance radius in miles
 * @return {integer}          return 1 if within radius, else 0
 */

function haversine(nlat, nlong, mlat, mlong, distance) {

	var R = 6371; // radius of earth in km
	var distances = [];
	var closest = -1;
	var dLat = rad(mlat - nlat);
	var dLong = rad(mlong - nlong);
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(nlat)) * Math.cos(rad(nlat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	if (d < distance) {
		return 1;
	} else {
		return 0;
	}
}

function rad(x) {
	return x * Math.PI / 180;
}


/**
 * Clear all markers after render
 */

function clearOverlays() {

	var size = markersArray.length;
	for (var i = 0; i < size; i++) {

		var marker = markersArray.pop();
		marker.setMap(null);
	}

	var clustersize = clusterArray.length;
	for (var i = 0; i < clustersize; i++) {
		var cluster = clusterArray.pop();
		cluster.clearMarkers();
	};
}


function findAddress(lat, lng) {
	var latlng = new google.maps.LatLng(lat, lng);
	geocoder.geocode({
		'latLng': latlng
	}, function(results, status) {
		console.log(results);
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[0]) {
				var street = results[0].formatted_address;
				console.log("User street: " + street);
				//console.log("City: ", )
				// alert(street);
				currentAddress = street;
				if (street.indexOf("San Francisco") !== -1) {
					$(".start").val(street);
				}
				// $(".start").val(street);
			} else {
				alert('No results found');
			}
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}

/**
 * Get information about current Day and Time
 * @return {Object} return day, prevDay, nextDay, and time
 */

function getDate() {
	var date = new Object;
	var d = new Date();
	var weekday = new Array(7);
	weekday[0] = "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";

	if (d.getDay() == 0)
		date.prevDay = weekday[6]
	else
		date.prevDay = weekday[d.getDay() - 1];
	if (d.getDay() == 6)
		date.nextDay = weekday[0]
	else
		date.nextDay = weekday[d.getDay() + 1];

	date.day = weekday[d.getDay()];
	date.time = d.getHours() * 100 + d.getMinutes();

	return date;
}

/**
 * Generate information for infowindows on markers
 * @param  {Object} data data about crime reports
 * @return {String}      Html string for infowindow
 */

function generateInfo(data) {

	text = '<div class="marker">';
	text += '<a1>' + data.Category + '<br></a1>'
	text += '<a2>' + data.Description + ' </a2>'
	var minutes = data.Time - Math.floor(data.Time / 100) * 100;
	text += '<a2><br>' + data.DayOfWeek + ', Time - </a2>'
	var hours = Math.floor(data.Time / 100);
	if (hours > 12) {
		hours -= 12;
	} else if (hours == 0) {
		hours = 12;
	}

	text += '<a2>' + hours + ':' + minutes + '</a2>'
	//   text += '<div class="check_in">Check In!</div> '
	text += '</div>'
	return text;
}
