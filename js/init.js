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
	};
	
	//console.log("userLocation is " + userLocation);
	//
	init();

});

$(document).delegate('#page1', 'pageshow', function () {
	// console.log($(window).height());
    var the_height = ($(window).height() - $(this).find('[data-role="header"]').height() - $(this).find('[data-role="footer"]').height());
    $(this).height($(window).height()).find('[data-role="content"]').height(the_height);
});

$(document).delegate('#page2', 'pageshow', function() {	
	var the_height = ($(window).height() - $(this).find('[data-role="header"]').height() - $(this).find('[data-role="footer"]').height());
    $(this).height($(window).height()).find('[data-role="content"]').height(the_height);
	var start = $(".start").val();
	var end = $(".end").val();

	//ASSUME START & END LOCATION IS IN A SUPPORTED CITY
	//TODO: WRITE A TEST CASE FOR NOT SUPPORTED CITIES
	//TODO: CHECK THE END POINT

	var validRoute = true; //keeps track of valid routes

	console.log("(--------- VALIDATE START AND END ---------")
	if(validateCity(start) && validateCity(end))
		validRoute = true;
	else
		validRoute = false;

	console.log("Valid Route: ")
	console.log(validRoute);

	console.log("(--------- INITIALIZE MAP ---------")
	if (!hasMapInit) {
		
		//User did not give us permission to geocode
		if(!aUser.getLat()){
			console.log("User lat information is not available so map not initiating ")
		}

		//START OR END IS NOT SUPPORTED
		else if(!validRoute){
			console.log("Sorry we do not support this city. Here are the results from Google Maps");
			initMap(aUser.getLat(),aUser.getLng(),function(){
				//TODO: RENDER RESULTS FROM GOOGLE MAPS
			});
		}

		else{
			//initiates the map
			initMap(aUser.getLat(), aUser.getLng(), function() {
				calcRoute(start, end);
			});
		}
		hasMapInit = true;
	} else {
		calcRoute(start, end);
	}
});

$(window).resize(function() {
	var the_height = ($(window).height() - $('#page1').find('[data-role="header"]').height() - $('#page1').find('[data-role="footer"]').height());
    $('#page1').height($(window).height()).find('[data-role="content"]').height(the_height);
    var the_height = ($(window).height() - $('#page2').find('[data-role="header"]').height() - $('#page2').find('[data-role="footer"]').height());
    $('#page2').height($(window).height()).find('[data-role="content"]').height(the_height);
	var start = $(".start").val();
	var end = $(".end").val();
	if (currentRouteNum != -1) {
		updateRouteRenderer(start, end, currentRouteNum);
	}
});