

function initData(dataLocation, callback){
	/*if (window.XMLHttpRequest)
		{// code for IE7+, Firefox, Chrome, Opera, Safari
		    xmlhttp=new XMLHttpRequest();
		}
		else
		{// code for IE6, IE5
		    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.open("GET",dataLocation,false);
		xmlhttp.send();
		xmlDoc=xmlhttp.responseText;
		processData(xmlDoc);*/



	$.ajax({
		type: "GET",
		url: dataLocation,
		dataType: "json",
		success: function(data) {
			console.log("-- REQUESTING CRIME DATA FROM SERVER --")
			//console.log("Total Crimes: ", data[0])
			
			database = data;

			/* debugging */

			var numCrimes = 0;
			for (var key in data){
				numCrimes = numCrimes + 1;
				//if((numCrimes%10) == 0)
				//	findAddress(data.Y,data.X);
			}
			console.log("Crimes Retrieved from DB: ", numCrimes);

			//database = JSON.stringify(eval("("+data+")"));

			//processData(data[1]);
			callback();
		}
	});
}


function processData(allText) {
	var allTextLines = allText.split(/\r\n|\n/);
	var headers = allTextLines[0].split('\t');

	// alert(allTextLines.length);
	for (var i = 1; i < allTextLines.length; i++) {
		var data = allTextLines[i].split('\t');

		if (data.length == headers.length) {
			var tarr = new Object();
			//tarr.IncidntNum = data[0]
			tarr.Category = data[0]
			//tarr.Description = data[2]
			tarr.DayOfWeek = data[1]
			tarr.Date = data[4]
			var time = data[4].split(":");
			tarr.Time = time[0] + time[1];
			//tarr.PdDistrict = data[6]
			//tarr.Resolution = data[7]
			//tarr.Address = data[8]
			tarr.X = data[5]
			tarr.Y = data[2]
			//tarr.Location = data[11]
			
			var key = tarr.DayOfWeek.hashCode();
			if (database[key]) {
				var hour = Math.floor(tarr.Time / 100);
				if (hour == 24) {
					hour = 0;
				}

				database[key][hour].push(tarr);
			} else {
				
				database[key] = new Array(24);
				for (var j = 0; j < database[key].length; j++) {
					database[key][j] = [];
				};


				var hour = Math.floor(tarr.Time / 100);
				if (hour == 24) {
					hour = 0;
				}
				database[key][hour].push(tarr);
			}
		}
	}
	console.log(database["Sunday".hashCode()])
}

//Extending String object to include a hashfunction
String.prototype.hashCode = function() {
	var hash = 0,
		i, char;
	if (this.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};