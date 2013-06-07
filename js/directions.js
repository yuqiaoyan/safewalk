$(document).ready(function() {

	$.ajax({
		url: 'http://maps.googleapis.com/maps/api/directions/json?origin=Boston,MA&destination=Concord,MA&waypoints=Charlestown,MA|via:Lexington,MA&sensor=false',
		type: 'GET',
		dataType: 'json',

		complete: function(xhr, textStatus) {
			//called when complete
		},
		success: function(data, textStatus, xhr) {
			console.log(JSON.stringify(data));
		},
		error: function(xhr, textStatus, errorThrown) {
			//called when there is an error
		}
	});
});