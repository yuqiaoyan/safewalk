var database = [];

$(document).ready(function() {
	$.ajax({
		type: "GET",
		url: "data/data_2.txt",
		dataType: "text",
		success: function(data) {
			processData(data);
		}
	});
});


function processData(allText) {
	var allTextLines = allText.split(/\r\n|\n/);
	var headers = allTextLines[0].split('\t');

	// alert(allTextLines.length);
	for (var i = 1; i < allTextLines.length; i++) {
		var data = allTextLines[i].split('\t');

		if (data.length == headers.length) {
			var tarr = new Object();
			tarr.IncidntNum = data[0]
			tarr.Category = data[1]
			tarr.Description = data[2]
			tarr.DayOfWeek = data[3]
			tarr.Date = data[4]
			var time = data[5].split(":");
			tarr.Time = time[0] + time[1];
			tarr.PdDistrict = data[6]
			tarr.Resolution = data[7]
			tarr.Address = data[8]
			tarr.X = data[9]
			tarr.Y = data[10]
			tarr.Location = data[11]
			
			// tarr.Date = data[0];
			// tarr.PdDistrict = data[1];
			// tarr.X = data[2];
			// tarr.Y = data[3];
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
}

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