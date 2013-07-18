if (debug) {

	//if we need to debug print out statistics about our code
	console.log("Route Crime Array Object: ");
	console.log(routeCrimePts);
	console.log("Total minimum crimes is " + routeCrimePts[0].totalCrimes);
};

function submit() {

}

function validateCity(address, cb) {
	/* REQUIRES STRING STREET ADDRESS LOCATION
	RETURNS TRUE IF CITY IS SUPPORTED OTHERWISE RETURN FALSE
	*/

	var validRoute = true;

	geocoder.geocode({
		'address': address
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var city;
			for (var i = 0; i < results[0].address_components.length; i++) {
				if (results[0].address_components[i].types[0] == "locality") {
					city = results[0].address_components[i].long_name;
					aUser.setCity(city);
					console.log("User's city is: ", aUser.getCity())
					break;
				}
			};

			//if the city is not supported then this is not a valid route
			if (!SUPPORTED_CITIES[city]) {
				console.log("Not supported city");
				console.log("start city: " + city);
				validRoute = false;
			} else {
				console.log("supported city");
				console.log("start city: " + city);
				validRoute = true;
			}
			cb(validRoute);
		} else {
			console.log("Google API RESULT ERROR");
			console.log("Status" + google.maps.GeocoderStatus.OK);
		}

	})

}

function getBestRoute() {
	console.log("+getBestRoute");

	//sort routeCrimePts to ascending order
	routeCrimePts.sort(function(value1, value2) {
		return value1.totalCrimes - value2.totalCrimes;
	})


	currentRouteNum = 0;
	console.log("-getBestRoute");

}

function chooseRoute(number) {

	var start = $(".start").val();
	var end = $(".end").val();
	updateMarkers(number)
	updateRouteRenderer(start, end, number);
	currentRouteNum = number;
	// calcRoute(start, end, number, false);

}

$(document).ready(function() {
		
	$('.title_grid, .step_header').on("click", function() {
		if ($('.directions').hasClass("min")) {
			$('.directions').removeClass("min")
			$('.directions').addClass("max")
			$('.directions_box').animate({
				height: "60%"
			}, 500);
			$('.directions_box').slideDown('slow');
		} else if ($('.directions').hasClass("max")) {
			$('.directions').removeClass("max")
			$('.directions').addClass("min")
			$('.directions_box').animate({
				height: initHeight + "px"
			}, 500);
		}

	});
});

function direction_transition(){
	resizeMap('#page2', initHeight);
	// $('.info').animate({height: '0px'},500);
	$('.info').css('display','none');
}