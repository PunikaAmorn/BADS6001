// get location

var information = {};
function getLocation() {
	//all car park information
	$.ajax({
	  url: 'hdb-carpark-information.json',
	  async: false,
	  dataType: 'json',
	  success: function (data) {
		information = data;
	  }
	});
	//get by location by navigator
	if (navigator.geolocation) {
		var check = navigator.geolocation.getCurrentPosition(showPosition);
		if(check == undefined){
			document.getElementById("inputLat").value = "1.4357238";			
			document.getElementById("inputLong").value = "103.7800097";		
			document.getElementById("numberCar").value = 5;
			init(1.4357238,103.7800097,5);
		}
	} else { 
		alert("Geolocation is not supported by this browser.");
		document.getElementById("inputLat").value = "1.4357238";
		document.getElementById("inputLong").value = "103.7800097";
		document.getElementById("numberCar").value = 5;
		init(1.4357238,103.7800097,5);
	}
}

//show input position
function showPosition(position) {
	document.getElementById("inputLat").value = position.coords.latitude;
	document.getElementById("inputLong").value = position.coords.longitude;
	//document.getElementById("inputLoc").value = position.coords.latitude+","+position.coords.longitude;
	init(position.coords.latitude,position.coords.longitude,5);
}// singapore >>1.3139961,103.7041594


// create map by google api
var map;
var carparkAvaliable = {};
var carpark=[];
function init(x,y,number) {
	// Basic options for a simple Google Map
	// For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
	var mapOptions = {
		// How zoomed in you want the map to start at (always required)
		zoom: 15,

		// The latitude and longitude to center the map (always required)
		center: new google.maps.LatLng(x,y), // weltronroyaltech.co.,ltd

		// How you would like to style the map. 
		// This is where you would paste any style found on Snazzy Maps.
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
	
	// get avaliable car park
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
	
	marker = {};
	for(i=0 ;i<number;i++){
		setMap(i+1,getDistance[i]['lat'],getDistance[i]['lon']);
	}
}
	
// 5 marker the nearest (global value)
var marker = {};
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
		if(obj[key]['carpark_info'][0]['lots_available']>1){
			lots[obj[key]['carpark_number']] = {'lots_available' : obj[key]['carpark_info'][0]['lots_available']};
		}
	});
	return lots;
}

function findDistance(x1,y1){ //x1,y1 from latitude and longitude from user location
	var distance = [];
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








