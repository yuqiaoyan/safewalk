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
	var minutes = routeCrimePts[routeNum].duration.split(' ');
	var routeDiv = "<div class = 'route'> Via "
	routeDiv += "<strong>" + routeCrimePts[routeNum].via + "</strong></div>"
	routeDiv += "<div class = 'side_text'><span class = 'crime'> <strong>"
	routeDiv += routeCrimePts[routeNum].totalCrimes + "</strong>\t crimes</span><br>"
	routeDiv += "<span class = 'time'><strong>" + minutes[0] + "</strong> min</span>"
	routeDiv += "</div>";
	return routeDiv;
}

function renderRoutes() {
	//Draws the 3 routes on the result page
	console.log("<--render routes-->");
	$('.leaf').remove();
	console.log("size - ", routeCrimePts.length);
	for (var i = 0; i < routeCrimePts.length; i++) {
		if (i == 0) {
			$('.leaf_frame').append("<div class='leaf active' onclick='javascript:chooseRoute(" + i + ")' >" + renderRoute(i) + "</div>");
		} else {
			$('.leaf_frame').append("<div class='leaf' onclick='javascript:chooseRoute(" + i + ")' >" + renderRoute(i) + "</div>");
		}
	}
	$('.leaf').on('click', function() {
		$('.active').removeClass('active');
		$(this).addClass('active');

	});
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
			$('.step_block').remove();
			$('.title_block').remove();
			$('.directions').css('height', '0');
			directionsDisplay.setDirections(response);

			if (validRoute) {
				if (response.routes[routeCrimePts[number].routeNum].legs[0].steps.length) {
					var summary = response.routes[routeCrimePts[number].routeNum].summary
					var duration = response.routes[routeCrimePts[number].routeNum].legs[0].duration.text;
					displayRoute(summary, duration);

					// $('.pulldown').css('display', 'block');
					initHeight = $('.directions_box').outerHeight(true);
					// $('.directions_box').css('height', initHeight + 'px');
					for (var i = 0; i < response.routes[routeCrimePts[number].routeNum].legs[0].steps.length; i++) {
						// console.log("waypoints - ", response.routes[0].legs[0].steps[i].instructions);
						step = response.routes[routeCrimePts[number].routeNum].legs[0].steps[i];
						displaySteps(step , i)
					};

				}

				directionsDisplay.setRouteIndex(routeCrimePts[number].routeNum);
			} else {

				if (response.routes[0].legs[0].steps.length) {
					var summary = response.routes[0].summary
					var duration = response.routes[0].legs[0].duration.text;
					displayRoute(summary, duration);

					// $('.pulldown').css('display', 'block');
					initHeight = $('.directions_box').outerHeight(true);
					// $('.directions_box').css('height', initHeight + 'px');
					for (var i = 0; i < response.routes[0].legs[0].steps.length; i++) {
						step = response.routes[0].legs[0].steps[i];
						displaySteps(step)
					};

				}
			}
		} else {
			console.log("Unable to get directionService information");
		}
	});
}

function displaySteps(step, i) {
	console.log("steps", step.instructions);
	var distance = Math.round(convertMtToFt(step.distance.value));
	if (distance >= 528) {
		distance = step.distance.text;
	} else {
		distance += " ft";
	}
	var block = "";
	if(i%2==0){
		block+="<div class='step_block active'>";
	}else{
		block+="<div class='step_block'>";
	}
	
	block+="<div class='dir_picture blocks'></div>"
	block+="<div class='dir_instructions blocks'>" + step.instructions + "</div>";
	block+="<div class='dir_distance blocks'>" + distance + "</div>";
	block+="</div>"
	$('.directions').append(block);
	
}

function displayRoute(summary, duration) {
	// $('.title_grid').append("<div class='ui-block-a title_block tba'></div>")
	// $('.title_grid').append("<div class='ui-block-b title_block tbb'>" + summary + "</div>");
	// $('.title_grid').append("<div class='ui-block-c title_block tbc'>" + duration) + "</div>";
	var block = "";
	block+="<div class='title_block'>";
	block+="<div class='dir_picture blocks'></div>"
	block+="<div class='dir_instructions blocks'>" + summary + "<br>"+duration+"</div>";
	// block+="<div class='dir_distance blocks'>" + duration + "</div>";
	block+="</div>"
	$('.title_grid').append(block)
}



function convertMtToFt(meters) {
	return meters * 3.28084;
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
	console.log("Size - ", routeCrimePts[number].array.length);
	console.log("Last - ", routeCrimePts[number].last);
	for (var i = routeCrimePts[number].last + 1, j = 0; i < routeCrimePts[number].array.length; i++) {
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