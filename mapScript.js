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
			reset();
			init(1.2867309,103.8542765,5);
		}
	} else { 
		alert("Geolocation is not supported by this browser.");
		reset();
		init(1.2867309,103.8542765,5);
	}
}

//show input position if get location by navigator
function showPosition(position) {
	document.getElementById("inputLat").value = position.coords.latitude;
	document.getElementById("inputLong").value = position.coords.longitude;
	init(position.coords.latitude,position.coords.longitude,5);
}


// create map by google api
var map;
function createMap(x,y){
	// For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
	var mapOptions = {
		// How zoomed in you want the map to start at (always required)
		zoom: 15,

		// The latitude and longitude to center the map (always required)
		center: new google.maps.LatLng(x,y)
	};
		
	// Get the HTML DOM element that will contain your map 
	var mapElement = document.getElementById('map');

	// Create the Google Map using our element and options defined above
	map = new google.maps.Map(mapElement, mapOptions);	

}

var carparkAvaliable = {};
var carpark=[];
function init(x,y,number) {
	/////////// Map ///////////
	createMap(x,y);
	
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
	
	// Euclidean Distance
	var getDistance = findDistance(x,y,carparkAvaliable);
	
	//function marker avaliable car park
	marker = {}; 
	if(getDistance.length<number){number = getDistance.length;}
	for(var i=0 ;i<number;i++){
		setMap(i+1,getDistance[i]['lat'],getDistance[i]['lon'],getDistance[i]['name']);
	}
}	

//get avaliable car park from filter
function avaliablePark(carpark){
	var lots = {};
	var obj = carpark.items[0]['carpark_data'];
	var nightPark = $("#nightPark").val();
	var typeSystem = $("#typeSystem").val();
	var typePark = $("#typePark").val();
	var filterCheck = false;
	
	Object.keys(obj).forEach(function(key) {
		filterCheck = false;
		var carpark_id = obj[key]['carpark_number'];
		if(information[carpark_id] != undefined){
			//check night park 
			if(nightPark=="NO" || information[carpark_id]['night_parking']=="YES"){
				//check type of parking system (ELECTRONIC or COUPON)				
				if(typeSystem=="all" || information[carpark_id]['type_of_parking_system'].indexOf(typeSystem) !== -1){
					//check car park type (BASEMENT, COVERED, MECHANISED, MULTI-STOREY, SURFACE)
					if(typePark=="all" || information[carpark_id]['car_park_type'].indexOf(typePark) !== -1){
						filterCheck = true;
					}
				}
			}
			//if  filterCheck is true
			if(filterCheck == true){
				if(obj[key]['carpark_info'][0]['lots_available']>=5){ //if avaliable car park >=5 lots 
					lots[carpark_id] = {'lots_available' : obj[key]['carpark_info'][0]['lots_available']};
				}
			}
		}
	});
	return lots;
}

//find all avaliable car park distance
function findDistance(x1,y1,carparkAvaliable){ //x1,y1 from latitude and longitude from user location
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

//sort object by distance
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

// 5 marker the nearest (global value)
var marker = {};
var infowindow = {};
//function set marker
function setMap(num,locX,locY,id){
	marker['N'+num] = new google.maps.Marker({
		position: new google.maps.LatLng(locX,locY),
		map: map,
		icon: 'img/mark-icon.png',
		animation: google.maps.Animation.DROP,
		title: num+") "+id+" : "+locX+","+locY
	});
	infowindow['N'+num] = new google.maps.InfoWindow({
	  content: setTitleMarker(num,id),
	  maxWidth: 250
	});
	marker['N'+num].addListener('click', function() {
          infowindow['N'+num].open(map, marker['N'+num]);
    });
	
}

function setTitleMarker(num,id){
	var infoText = "";
	var info = information[id];
	infoText = 
	num+") "+id+
	"<br> Address: "+info["address"]+
	"<br> Type:&emsp;"+info["car_park_type"]+
	"<br> System:&emsp;&emsp;"+info["type_of_parking_system"]+
	"<br> Free Parking:&emsp;"+info["free_parking"]+
	"<br> Night Parking:  "+info["night_parking"]+
	"<br> Short Term Parking: "+info["short_term_parking"]+
	"<br> Location:&emsp;"+info["x_coord"]+
	" , <br>&emsp;&emsp;&emsp;&emsp;&emsp;"+info["y_coord"];

	return infoText;
}







