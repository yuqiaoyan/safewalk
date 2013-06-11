var start = "101 Post St. San Francisco, CA 94180";
var end = "66 Mint Plaza  San Francisco, CA 94103";

var milli = "milliseconds";

function dataPerformance(start,end){
	//test data 

	var start = +new Date(); //log start timestamp


	initData("../../data/data_2.txt");

	$(document).ajaxComplete(function(){
		console.log("+ajaxComplete");

		var end = +new Date(); //log end timestamp
		var diff = end-start;

		$(".result").html("The processing time for data is " + diff + " in " + milli);

		console.log("-ajaxComplete");
	});


}

dataPerformance(start,end);