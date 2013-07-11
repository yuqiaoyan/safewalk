function init() {
	//TODO: MOVE INIT TO AFTER THE USER CLICKS SUBMIT

	var localURL = "data/data_2.txt" 
	var amazonIP = "kebangg.com"
	var IP = "localhost"
	var requestURL = "http://" + IP + ":5000/?"
	console.log("requestURL IS",requestURL)
	var d = new Date();
	time = d.getHours() + ":" + d.getMinutes(); 
	
	var parameters = "day=" + aUser.getToday() + "&city=" + "SanFrancisco" + "&time=" + time;
	var testParameters = "day=" + "Monday" + "&city=" + "SanFrancisco" + "&time=" + time;
	requestURL = requestURL + testParameters;
	console.log("requestURL",requestURL)

	//TODO: Debug Flask cross domain

	console.log("+data processing");
	initData(requestURL, function() {
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

	validRoute = true; //keeps track of valid routes

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
				runMap(start, end);
			});
		} else {
			validRoute = false;
			runMap(start, end);
		}

	});

});

function runMap(start, end) {
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
				calcRoute(start, end);
			});
		}

	} else {
		calcRoute(start, end);
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
