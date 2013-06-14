function init(){
	console.log("+data processing");
	initData("data/data_2.txt", function(){
		$('.submit').removeClass('ui-disabled')
	});
	console.log("-data processing");

}

$(document).ready(function() {
	//console.log("Window URL: " + window.location.pathname);

	var debugValue = document.URL.split('debug=');
	
	if(debugValue.length > 1){
		debug = debugValue[1]; //set a debug value to print out useful information
	}
	navigator.geolocation.getCurrentPosition(userLocation, e);
	init();
	
});

$(document).delegate('#page3', 'pageshow', function() {
	
	var start = $(".start").val();
	var end = $(".end").val();
	if (!hasMapInit) {
		initMap(lat, lng, function() {
			calcRoute(start, end);
		});
		hasMapInit = true;
	} else {
		calcRoute(start, end);
	}
});