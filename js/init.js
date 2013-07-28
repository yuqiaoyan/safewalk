function init(start, end) {
	//TODO: MOVE INIT TO AFTER THE USER CLICKS SUBMIT

	var amazonIP = "ec2-54-215-147-231.us-west-1.compute.amazonaws.com"
	var IP = "localhost"
	var requestURL = "http://" + amazonIP + ":5000/?"
	//console.log("requestURL IS", requestURL)
	var d = new Date();
	time = d.getHours() + ":" + d.getMinutes();

	// var city = aUser.getCity()
	// console.log(city.split(' '))
	// if (city.split(' ').length > 1) {
	// 	city = city.replace(/\s+/g, '');
	// 	console.log("city is", city)


	// }
	var city = SUPPORTED_CITIES[aUser.getCity()];

	if (city) {
		var parameters = "day=" + aUser.getToday() + "&city=" + city + "&time=" + time + "&start="+start+"&end="+end;
		console.log("start", start)
		console.log("end", end)
		requestURL = requestURL + parameters;
		console.log("requestURL", requestURL)
		console.log("+data processing");
		initData(requestURL, function() {
			runMap(start, end);
		});
		console.log("-data processing");
		//TODO: Debug Flask cross domain
	} else
		runMap(start, end);


}

$(document).ready(function() {
	//console.log("Window URL: " + window.location.pathname);
	$('.submit').removeClass('ui-disabled')
	var debugValue = document.URL.split('debug=');

	if (debugValue.length > 1) {
		debug = debugValue[1]; //set a debug value to print out useful information
	};
	//console.log("userLocation is " + userLocation);
	//


});

$(document).delegate('#page1', 'pageshow', function() {
	resizeHeight('#page1');
	$('.loading').css('display', 'block');
});

$(document).delegate('#page2', 'pageshow', function() {

	resizeHeight('#page2');
	$('.info').css('height', 'auto');
	$('.info').css('display', 'block');
	var start = $(".start").val();
	var end = $(".end").val();


	//ASSUME START & END LOCATION IS IN A SUPPORTED CITY
	//TODO: WRITE A TEST CASE FOR NOT SUPPORTED CITIES
	//TODO: CHECK THE END POINT

	validRoute = true; //keeps track of valid routes

	console.log("(--------- VALIDATE START AND END ---------")
	validateCity(start, function(validRouteA) {
		console.log("Check start location");
		if (validRouteA) {
			console.log("Check end location");
			validateCity(end, function(validRouteB) {

				//CRIME IS VALID
				if (validRouteB) {
					console.log("THIS IS A VALID CITY")
					validRoute = true;

				} else {
					validRoute = false;
				}
				init(start, end);

			});
		} else {
			validRoute = false;
			init(start, end);
		}

	});

});

$(window).resize(function() {

	resizeHeight('#page1');
	resizeHeight('#page2');

	if (isLeaf) {

		resizeMap('#page2', $('.info').height() + $('.direction_button').height());
	} else {

		resizeMap('#page2', initHeight);
	}
	var inputDiv = document.getElementById("routeInput")
	inputDiv.scrollTop = inputDiv.scrollHeight;
	// if (map) {
	// 	var center = map.getCenter();
	// 	google.maps.event.trigger(map, 'resize');
	// 	map.setCenter(center);
	// }

	var start = $(".start").val();
	var end = $(".end").val();
	google.maps.event.trigger(map, 'resize');
	if (currentRouteNum != -1) {
		updateRouteRenderer(start, end, currentRouteNum);
	}

});

function runMap(start, end) {
	console.log("Valid Route: ")
	console.log(validRoute);
	var lat = 0;
	var lng = 0;
	console.log("(--------- INITIALIZE MAP ---------")
	if (!hasMapInit) {

		//User did not give us permission to geocode
		// if (!aUser.getLat()) {
		// 	console.log("User lat information is not available so map not initiating ")
		// }

		//START OR END IS NOT SUPPORTED
		// else {
		//initiates the map
		initMap(lat, lng, function() {
			hasMapInit = true;
			calcRoute(start, end);
		});
		// }

	} else {
		calcRoute(start, end);
	}
}

function resizeHeight(page) {
	var the_height = ($(window).height() - $(page).find('[data-role="header"]').height() - $(page).find('[data-role="footer"]').height());
	$(page).height($(window).height()).find('[data-role="content"]').height(the_height);

}

function resizeMap(page, height) {
	var start = $(".start").val();
	var end = $(".end").val();

	var the_height = ($(window).height() - $(page).find('[data-role="header"]').height() - height) + 20;
	$(page).height($(window).height()).find('[data-role="content"]').height(the_height);

	// var center = map.getCenter();
	// google.maps.event.trigger(map, 'resize');
	// map.setCenter(center);
	google.maps.event.trigger(map, 'resize');
	if (currentRouteNum != -1) {
		updateRouteRenderer(start, end, currentRouteNum);
	}
}