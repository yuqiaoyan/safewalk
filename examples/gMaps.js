var directionDisplay;
var directionsService;
var start = "35 Folsom St. San Francisco CA"
var end = "2000 Trousdale Drive Burlingame CA"
var map; 

$(document).ajaxComplete(function(){
  console.log("start");
})

function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          panControl: false,
  		  zoomControl: false,
  		  mapTypeControl: false,
  		   scaleControl: false
  		  // streetViewControl: boolean,
  		  // overviewMapControl: boolean

        };
        map= new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map)
        directionsService = new google.maps.DirectionsService();
        updateRouteRenderer(start,end)
    
}





       
google.maps.event.addDomListener(window, 'load', initialize);

  

console.log("end");