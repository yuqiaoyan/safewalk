
if(debug){

	//if we need to debug print out statistics about our code
	console.log("Route Crime Array Object: ");
	console.log(routeCrimePts);
	console.log("Total minimum crimes is " + routeCrimePts[0].totalCrimes);
};

function submit() {
	
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

