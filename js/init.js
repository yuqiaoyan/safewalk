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
	if (!hasMapInit) {
		initMap(lat, lng, function() {
			calcRoute(start, end);
		});
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