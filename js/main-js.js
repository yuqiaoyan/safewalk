
if(debug){

	//if we need to debug print out statistics about our code
	console.log("Route Crime Array Object: ");
	console.log(routeCrimePts);
	console.log("Total minimum crimes is " + routeCrimePts[0].totalCrimes);
};

function submit() {
	
}

function validateCity(address, cb){
	/* REQUIRES STRING STREET ADDRESS LOCATION
	RETURNS TRUE IF CITY IS SUPPORTED OTHERWISE RETURN FALSE
	*/

	var validRoute = true;

	geocoder.geocode({'address': address}, function(results,status){
		if(status == google.maps.GeocoderStatus.OK){
			var city;
			for (var i = 0; i < results[0].address_components.length; i++) {
				if(results[0].address_components[i].types[0] == "locality"){
					city = results[0].address_components[i].long_name;
					aUser.setCity(city);
					console.log("User's city is: ", aUser.getCity())
					break;
				}
			};
			 
			//if the city is not supported then this is not a valid route
			if(!SUPPORTED_CITIES[city]){
				console.log("Not supported city");
				console.log("start city: " + city);
				validRoute = false;
			}
			else{
				console.log("supported city");
				console.log("start city: " + city);
				validRoute = true;
			}
			cb(validRoute);
		}
		else{
			console.log("Google API RESULT ERROR");
			console.log("Status" + google.maps.GeocoderStatus.OK);
		}
		
	})	
	
}

function getBestRoute() {
	console.log("+getBestRoute");

	//sort routeCrimePts to ascending order
	routeCrimePts.sort(function(value1,value2){
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
	// calcRoute(start, end, number, false);

}

$(document).ready(function() {
	$('.pulldown').on("click", function() {
		if ($(this).hasClass("min")) {
			$(this).removeClass("min")
			$(this).addClass("max")
			$('.dir_height').animate({
				height: "100%"
			}, 1000);
			$('.dir_height').slideDown('slow');
		} else if ($(this).hasClass("max")) {
			$(this).removeClass("max")
			$(this).addClass("min")
			$('.dir_height').animate({
				height: initHeight + "px"
			}, 1000);
		}

	});
});
