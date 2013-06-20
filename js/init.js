function init() {
	console.log("+data processing");
	initData("data/data_2.txt", function() {
		$('.submit').removeClass('ui-disabled')
	});
	console.log("-data processing");

}

$(document).ready(function() {
	//console.log("Window URL: " + window.location.pathname);

	var debugValue = document.URL.split('debug=');

	if (debugValue.length > 1) {
		debug = debugValue[1]; //set a debug value to print out useful information
	};

	//console.log("userLocation is " + userLocation);
	//
	init();

});

$(document).delegate('#page1', 'pageshow', function() {
	// console.log($(window).height());
	resizeHeight('#page1');
});

$(document).delegate('#page2', 'pageshow', function() {
	resizeHeight('#page2');
	var start = $(".start").val();
	var end = $(".end").val();

	//ASSUME START & END LOCATION IS IN A SUPPORTED CITY
	//TODO: WRITE A TEST CASE FOR NOT SUPPORTED CITIES
	//TODO: CHECK THE END POINT

	var validRoute = true; //keeps track of valid routes

	console.log("(--------- VALIDATE START AND END ---------")
	validateCity(start, function(validRouteA) {
		console.log("Check start location");
		if (validRouteA) {
			console.log("Check end location");
			validateCity(end, function(validRouteB) {
				if (validRouteB) {
					validRoute = true;
				} else {
					validRoute = false;
				}
				runMap(validRoute, start, end);
			});
		} else {
			validRoute = false;
			runMap(validRoute, start, end);
		}

	});

});

function runMap(validRoute, start, end) {
	console.log("Valid Route: ")
	console.log(validRoute);

	console.log("(--------- INITIALIZE MAP ---------")
	if (!hasMapInit) {

		//User did not give us permission to geocode
		if (!aUser.getLat()) {
			console.log("User lat information is not available so map not initiating ")
		}

		//START OR END IS NOT SUPPORTED
		else {
			//initiates the map
			initMap(aUser.getLat(), aUser.getLng(), function() {
				hasMapInit = true;
				calcRoute(start, end, validRoute);
			});
		}

	} else {
		calcRoute(start, end, validRoute);
	}
}


$(window).resize(function() {
	resizeHeight('#page1');
	resizeHeight('#page2');
	var start = $(".start").val();
	var end = $(".end").val();
	if (currentRouteNum != -1) {
		updateRouteRenderer(start, end, currentRouteNum);
	}
});

function resizeHeight(page){
	var the_height = ($(window).height() - $(page).find('[data-role="header"]').height() - $(page).find('[data-role="footer"]').height());
	$(page).height($(window).height()).find('[data-role="content"]').height(the_height);
}