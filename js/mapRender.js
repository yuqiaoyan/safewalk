/* contains all functions for rendering */

function renderUser(){
	console.log("+renderUser");
	console.log("user Location: ");
	console.log(aUser);
	
	var point = aUser.getPt();

	var marker = new google.maps.Marker({
          position: point,
          map: map,
          title: "Me!",
          icon:"img/blue_MarkerA.png",
          zIndex:2

    })

	console.log("-renderUser");
}

function renderRoute(routeNum) {
/* HTML for drawing a single routeInfo
REQUIRES: routeCrimePts and totalCrimes

*/

	var routeDiv = "<div class = 'route'> "
	routeDiv += routeCrimePts[routeNum].via
	routeDiv += "<div class = 'side_text'><span class = 'time'>" + routeCrimePts[routeNum].duration + "</span> - "
	routeDiv += " <span class = 'crime'> "
	routeDiv += routeCrimePts[routeNum].totalCrimes + "\t crimes </span> reported</div> "
	routeDiv += "</div>";
	return routeDiv;
}

function renderRoutes(){
//Draws the 3 routes on the result page

	for (var i = 0; i < routeCrimePts.length; i++) {
		if (i == 0) {
			$(".leaf1").html(renderRoute(i));
		} else if (i == 1) {
			$(".leaf2").html(renderRoute(i));
		} else {
			$(".leaf3").html(renderRoute(i));
		}
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
			directionsDisplay.setRouteIndex(routeCrimePts[number].routeNum);
		}
		else{
			console.log("Unable to get directionService information");
		}
	});
	google.maps.event.trigger(map, 'resize');

	updateMarkers(number);
}

/**
 * Updates rendering for markers
 * @param  {int} number index of current route
 */

function updateMarkers(number) {
	clearOverlays();
	// console.log(routeCrimePts);
	var markers = [];

	// for (var i = 0; i < routeCrimePts[number].pathkb.length; i++) {
	// 	createPath(routeCrimePts[number].pathjb[i], routeCrimePts[number].pathkb[i]);
	// };

	console.log("+updateMarkers");
	console.log("array length: " + routeCrimePts[number].array.length);
	console.log("routeCrimePts[number].last " + routeCrimePts[number].last);

	for (var i = routeCrimePts[number].last, j = 0; i < routeCrimePts[number].array.length; i++) {
		markers[j++] = createMark(routeCrimePts[number].array[i].Y, routeCrimePts[number].array[i].X, number);
		createInfoWindow(markers[j - 1], number, i);
	}

	var mcOptions = {
		gridSize: 50,
		maxZoom: 20
	};
	var markerCluster = new MarkerClusterer(map, markers, mcOptions);
	clusterArray.push(markerCluster);
}