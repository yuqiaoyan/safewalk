
if(debug){

	//if we need to debug print out statistics about our code
	console.log("Route Crime Array Object: ");
	console.log(routeCrimePts);
	console.log("Total minimum crimes is " + routeCrimePts[0].totalCrimes);
};

function submit() {
	
}

function validateCity(address){
	/* REQUIRES STRING STREET ADDRESS LOCATION
	RETURNS TRUE IF CITY IS SUPPORTED OTHERWISE RETURN FALSE
	*/

	geocoder.geocode({'address': address}, function(results,status){
		if(status == google.maps.GeocoderStatus.OK){
			var city = results[0].address_components[3].long_name; 
			
			//if the city is not supported then this is not a valid route
			if(!SUPPORTED_CITIES[city]){
				console.log("Not supported city");
				console.log("start city: " + city);
				return false;
			}
		}
		else{
			console.log("Google API RESULT ERROR");
			console.log("Status" + google.maps.GeocoderStatus.OK);
		}
	})	

	return true;

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
	updateRouteRenderer(start, end, number);
	// calcRoute(start, end, number, false);

}

