// get location
function getLocation() {
	if (navigator.geolocation) {
		var check = navigator.geolocation.getCurrentPosition(showPosition);
		if(check == undefined){
			document.getElementById("inputLoc").value = "1.3139961,103.7041594";
			init(1.3139961,103.7041594);
		}
	} else { 
		alert("Geolocation is not supported by this browser.");
		document.getElementById("inputLoc").value = "1.3139961,103.7041594";
		init(1.3139961,103.7041594);
	}				
}

//show input position
function showPosition(position) {
	document.getElementById("inputLoc").value = position.coords.latitude+","+position.coords.longitude;
	init(position.coords.latitude,position.coords.longitude);
}// singapore >>1.3139961,103.7041594


// create map by google api
var map;
function init(x,y) {
	// Basic options for a simple Google Map
	// For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
	var mapOptions = {
		// How zoomed in you want the map to start at (always required)
		zoom: 15,

		// The latitude and longitude to center the map (always required)
		center: new google.maps.LatLng(x,y), // weltronroyaltech.co.,ltd

		// How you would like to style the map. 
		// This is where you would paste any style found on Snazzy Maps.
		styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":10}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#fafafa"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#e1e1e1"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#8dc63f"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e1e1e1"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#e1e1e1"}]}]
	};

	// Get the HTML DOM element that will contain your map 
	// We are using a div with id="map" seen below in the <body>
	var mapElement = document.getElementById('map');

	// Create the Google Map using our element and options defined above
	map = new google.maps.Map(mapElement, mapOptions);

	// Let's also add a marker while we're at it
	var myLocMarker = new google.maps.Marker({
		position: new google.maps.LatLng(x,y),
		map: map,
		icon: 'img/car-icon.png'
	});
	
	
}
	
// 5 marker the nearest (global value)
var marker = {N1:0,N2:0,N3:0,N4:0,N5:0};
//function set marker
function setMap(num,locX,locY){

	marker['N'+num] = new google.maps.Marker({
		position: new google.maps.LatLng(locX,locY),
		map: map,
		icon: 'img/mark-icon.png'
	});
}