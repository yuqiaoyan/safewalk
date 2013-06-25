/* contains all functions for rendering */

function renderUser() {
	console.log("+renderUser");
	console.log("user Location: ");
	// console.log(aUser);

	// var point = aUser.getPt();
	navigator.geolocation.getCurrentPosition(function(position) {
		var point = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		if (userMarker) {
			userMarker.setPosition(point);
		} else {
			console.log("create hippo icon");
			var pinIcon = new google.maps.MarkerImage(
				"img/hippo.png",
				null, /* size is determined at runtime */
				null, /* origin is 0,0 */
				null, /* anchor is bottom center of the scaled image */
				new google.maps.Size(30, 20));

			userMarker = new google.maps.Marker({
				position: point,
				map: map,
				title: "Me!",
				icon: pinIcon,
				zIndex: 2

			});
		}
		// map.setCenter(point);
	});
	console.log("-renderUser");
	if (isTracking)
		setTimeout(renderUser, 5000);
}

function renderRoute(routeNum) {
	/* HTML for drawing a single routeInfo
	REQUIRES: routeCrimePts and totalCrimes*/

	var routeDiv = "<div class = 'route'> "
	routeDiv += routeCrimePts[routeNum].via
	routeDiv += "<div class = 'side_text'><span class = 'time'>" + routeCrimePts[routeNum].duration + "</span> - "
	routeDiv += " <span class = 'crime'> "
	routeDiv += routeCrimePts[routeNum].totalCrimes + "\t crimes </span> reported</div> "
	routeDiv += "</div>";
	return routeDiv;
}

function renderRoutes() {
	//Draws the 3 routes on the result page
	console.log("<--render routes-->");
	$('.leaf').remove();
	console.log("size - ", routeCrimePts.length);
	for (var i = 0; i < routeCrimePts.length; i++) {
		$('.info').append("<div class='leaf' onclick='javascript:chooseRoute(" + i + ")' >" + renderRoute(i) + "</div>");
	}
}

/**
 * Updates direction display
 * @param  {string} start  lat and lng of start location
 * @param  {string} end    lat and lng of destination
 * @param  {int} number index of current route
 */

function updateRouteRenderer(start, end, number) {

	var request = {
		origin: start,
		destination: end,
		provideRouteAlternatives: true,
		travelMode: google.maps.DirectionsTravelMode.WALKING
	};

	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
			if (validRoute) {
				directionsDisplay.setRouteIndex(routeCrimePts[number].routeNum);
			}
		} else {
			console.log("Unable to get directionService information");
		}
	});
}

/**
 * Updates rendering for markers
 * @param  {int} number index of current route
 */

function updateMarkers(number) {

	clearOverlays();
	var markers = [];

	// for (var i = 0; i < routeCrimePts[number].pathkb.length; i++) {
	// 	createPath(routeCrimePts[number].pathjb[i], routeCrimePts[number].pathkb[i]);
	// };

	console.log("+updateMarkers");
	console.log("array length: " + routeCrimePts[number].array.length);
	console.log("routeCrimePts[number].last " + routeCrimePts[number].last);

	for (var i = routeCrimePts[number].last, j = 0; i < routeCrimePts[number].array.length; i++) {
		markers[j++] = createMark(routeCrimePts[number].array[i].Y, routeCrimePts[number].array[i].X);
		createInfoWindow(markers[j - 1], number, i);
	}

	var mcOptions = {
		gridSize: 50,
		maxZoom: 20
	};
	var markerCluster = new MarkerClusterer(map, markers, mcOptions);
	clusterArray.push(markerCluster);


}