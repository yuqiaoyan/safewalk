var currentRouteNum = -1;
var loaded = false;

function submit() {
	
}
var bestRoute;

function getBestRoute() {
	sortCrime();

	var start = $(".start").val();
	var end = $(".end").val();
	var minCrimes = routeCrimePts[0].totalCrimes;
	bestRoute = 0;
	console.log("Total crimes is " + routeCrimePts[0].totalCrimes);

	for (var i = 1; i < routeCrimePts.length; i++) {
		if (minCrimes > routeCrimePts[i].totalCrimes) {
			bestRoute = i;
			minCrimes = routeCrimePts[i].totalCrimes;
		}
	};

	console.log("Max Crimes " + minCrimes);
	console.log("bestRoute " + bestRoute);
	currentRouteNum = bestRoute;


}

function chooseRoute(number) {
	
	var start = $(".start").val();
	var end = $(".end").val();
	updateRouteRenderer(start, end, number);
	// calcRoute(start, end, number, false);


}



function sortCrime() {
	var temp;
	for (var i = 0; i < routeCrimePts.length - 1; i++) {
		for (var j = i + 1; j < routeCrimePts.length; j++) {
			if (routeCrimePts[i].totalCrimes > routeCrimePts[j].totalCrimes) {
				temp = routeCrimePts[j];
				routeCrimePts[j] = routeCrimePts[i];
				routeCrimePts[i] = temp;
			}
		}
	}
}

$(window).resize(function() {
	var start = $(".start").val();
	var end = $(".end").val();
	if (currentRouteNum != -1) {
		updateRouteRenderer(start, end, currentRouteNum);
	}

});