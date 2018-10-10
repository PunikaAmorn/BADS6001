// get location

var information = {};
function getLocation() {
	$.ajax({
	  url: 'hdb-carpark-information.json',
	  async: false,
	  dataType: 'json',
	  success: function (data) {
		information = data;
	  }
	});
	if (navigator.geolocation) {
		var check = navigator.geolocation.getCurrentPosition(showPosition);
		if(check == undefined){
			document.getElementById("inputLoc").value = "1.3139961,103.7041594";
			init(1.4357238,103.7800097);
		}
	} else { 
		alert("Geolocation is not supported by this browser.");
		document.getElementById("inputLoc").value = "1.3139961,103.7041594";
		init(1.4357238,103.7800097);
	}
}

//show input position
function showPosition(position) {
	document.getElementById("inputLoc").value = position.coords.latitude+","+position.coords.longitude;
	init(position.coords.latitude,position.coords.longitude);
}// singapore >>1.3139961,103.7041594


// create map by google api
var map;
var carparkAvaliable = {};
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
		/*styles: [{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"on"},{"lightness":10}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#fafafa"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#e1e1e1"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{"featureType":"road","elementType":"all","stylers":[{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#8dc63f"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e1e1e1"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"water","elementType":"all","stylers":[{"visibility":"on"},{"color":"#e1e1e1"}]}]
	*/};
		
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
	var carpark=[];
	$.ajax({
	  url: 'https://api.data.gov.sg/v1/transport/carpark-availability',
	  async: false,
	  dataType: 'json',
	  success: function (data) {
		carpark = data;
	  }
	});
	//get avaliable carpark > 0
	carparkAvaliable = avaliablePark(carpark);	//gat all distance 
	//console.log(carpark);
	//console.log(carparkAvaliable);
	// Euclidean Distance
	var getDistance = findDistance(x,y);
	
	setMap(1,getDistance[0]['lat'],getDistance[0]['lon']);
	setMap(2,getDistance[1]['lat'],getDistance[1]['lon']);
	setMap(3,getDistance[2]['lat'],getDistance[2]['lon']);
	setMap(4,getDistance[3]['lat'],getDistance[3]['lon']);
	setMap(5,getDistance[4]['lat'],getDistance[4]['lon']);
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

function avaliablePark(carpark){
	var lots = {};
	var obj = carpark.items[0]['carpark_data'];
	Object.keys(obj).forEach(function(key) {
		if(obj[key]['carpark_info'][0]['lots_available']>=5){
			lots[obj[key]['carpark_number']] = {'lots_available' : obj[key]['carpark_info'][0]['lots_available']};
		}
	});
	return lots;
}

var distance = [];
function findDistance(x1,y1){ //x1,y1 from latitude and longitude from user location
	Object.keys(information).forEach(function(key) {
		if(carparkAvaliable[key]){
			var x2 = information[key]["x_coord"];
			var y2 = information[key]["y_coord"];
			var dist = Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
			distance.push({'name': key ,'distance':dist ,'lat':x2 , 'lon':y2});
		}
	});
	
	return (distance.sort(dynamicSort('distance')));
}

//sort object
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}








