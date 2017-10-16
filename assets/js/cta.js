
// $(document).ready(function(){
var BusModule = (function(){
	//object to store details of the current request; will also be used to set preferred stop info
	var currentRequest = {
		routeNumber: null,
		direction  : null,
		stopId     : null,
		stpnm      : null
	}

	const idOfRouteDiv = "#routes";
	const idOfStopsDiv = "#stops";
	const idOfDirectionsDiv = "#directions";
	const idOfPanelTitleDiv = "#route-panel-title";
	//routes is a global variable in routes.js
	const arrayOfRoutes = routes;


	var prefRequest = false;
	//object to return with public methods
	var module = {};

//-----------------------//Methods//--------------------------//

//send a query to the CTA's bus tracker API
	queryCTA = function(queryType, queryParam = "", callback){
		var queryResult;
		var language = "en";
		const apiKey = "j3yumkkQfPsQd2E3GCE3XeEAW";
		var queryURL = "http://ctabustracker.com/bustime/api/v2/"+queryType+"?key=" + apiKey + '&format=json' + "&locale="+language+"&"+queryParam;
		console.log('queryURL', queryURL);
		const corsProxyURL = "https://cors-anywhere.herokuapp.com/";
		var url = (corsProxyURL + queryURL);// Used CORS proxy to avoid cross origin request issues. Otherwise, Access-Control-Allow-Origin or X-Requested-With request header is needed
		console.log('url', url);
		//ajax call to API
		$.ajax({
			url: url,
			method: "GET",
		}).done(function(response) {
			callback(response);
		})
		.fail(function(error) {
			console.log("error", error);
		})
		.always(function() {
			console.log("request complete");
		});
	}


	module.getPrefs = function(){
		prefRequest = true;
		return routesDropdown(arrayOfRoutes);
	}

//creates and displays a dropdown menu of bus routes
	routesDropdown = function(routesArray){
		var dropdown = $("<select required id='route-select' size=6>")
			.change(function(){ //event listener to call directionsDropdown once route is selected
				$(idOfStopsDiv).empty();
				var route = $(this).val();
				// console.log("route = ", route);
				currentRequest.routeNumber = route;
				// console.log('currentRequest', currentRequest);
				$(idOfPanelTitleDiv).html("Select a route");
				directionsDropdown($(this).val());
			});
		routesArray.forEach(function(route){
			var optionText = route.rt + "–" + route.rtnm;
			var option = $("<option>").attr("value", route.rt).text(optionText);
			$(dropdown).append(option);
		});
		$(idOfRouteDiv).append(dropdown);
	}

//creates and displays a dropdown menu of allowed route directions
	directionsDropdown = function(routeNumber){
		// console.log("directionsDropdown("+routeNumber+") called.");
		queryCTA("getdirections", ("rt="+routeNumber), (function(response){
			// console.log("response = ", response);
			var directions = response["bustime-response"].directions;
			// console.log("permitted directions = ", directions);
			var dropdown = $("<select required id='direction-select'>");
			dropdown.append($("<option>")
				.attr("value", null)
				.text("direction of travel"))
			.change(function(){ //event listener to call stopsDropdown once direction is selected
				var direction = $(this).val();
				// console.log('direction', direction)
				currentRequest.direction = direction;
				if(direction !== null){
					$(idOfPanelTitleDiv).html("Select your stop");
					stopsDropdown(routeNumber, direction);
				}
			});
		directions.forEach(function(direction){
			var option = $("<option>").attr("value", direction.dir).text(direction.dir);
			$(dropdown).append(option);
		});
		$(idOfDirectionsDiv).html(dropdown);
		}))	
	}

//creates and displays a dropdown menu of bus stops on selected route
	stopsDropdown = function(routeNumber, direction){
		// console.log("stopsDropdown(" + routeNumber + "," + direction + ") called");
		queryCTA("getstops", ("rt="+routeNumber+"&dir="+direction), (function(response){
			// console.log(response);
			var stops = response["bustime-response"].stops;
			// console.log("stops = ", stops);
			var dropdown = $("<select required id='stop-select' size=6>")
			.change(function(){ //event listener to call getPredictions once stop is selected
				var value = $(this).val().split(" ");
				var stopId = value[0];
				var stpnm = value.slice(1).join(" ");
				// console.log('stpnm', stpnm);
				// console.log('stopId', stopId);
				currentRequest.stopId = stopId;
				currentRequest.stpnm = stpnm;
				//if prefRequest, set preferences
				if (prefRequest === true) {
					return currentRequest;
				}
				// console.log('currentRequest', currentRequest);
				module.getPredictions(routeNumber, stopId);
			});
		stops.forEach(function(stop){
			var option = $("<option>").attr("value", stop.stpid + " " + stop.stpnm).text(stop.stpnm);
			$(dropdown).append(option);
		});
		$(idOfStopsDiv).html(dropdown);
		}))	
	}

	module.getPredictions = function(routeNumber, stopId){
		// console.log('getPredictions('+ routeNumber +', '+ stopId+') called.');
		var predictions;
		queryCTA("getpredictions", ("rt="+routeNumber+"&stpid="+stopId), (function(response){
			// console.log("getPredictions response = ", response);
			if (response["bustime-response"] === "error"){
				var error = response["bustime-response"].error[0].msg;
				console.log('error', error);
				return [currentRequest, error];
			} else if (response["bustime-response"] === "prd"){
				var predictions = response["bustime-response"].prd;
				console.log("predictions = ", predictions);
				return [currentRequest, predictions];
			}
		}))	
	}

	module.routeDisplay = function(msg, isError = false){
		//display info on screen
	}

	return module;

	//--------------------------//Utility functions//--------------------------//
	//returns an array of objects, each of which represents one of the bus routes
	// function ctaRoutes(){
	// 	console.log("ctaRoutes() called.");
	// 	queryCTA("getroutes", "", (function(response){
	// 		var routes = response["bustime-response"].routes;
	// 		console.log("routes", routes);
	// 		return routes;
	// 	}));	
	// }
	// const queryParams = {
	// 	"routes": ["getroutes", "routes"],
	// 	"directions": ["getdirections", "dir"],
	// 	"stops": ["getstops", "stops"],
	// 	"predictions": ["getpredictions", "prd"],
	// 	"bulletins": ["getservicebulletins", "sb"]
	// };
	// function getStops(routeNum, direction){
	// 	queryCTA("getstops", ("rt="+routeNum+"&dir="+direction), (function(response){
	// 		var stops = response["bustime-response"].stops;
	// 		console.log("stops", stops);
	// 		return stops;
	// 	}))
	// }
	// 	function log(response){
	// 	console.log("response", response);
	// }

}());//end of BusModule


BusModule.getPrefs();




// })//end of $(document).ready(function(){}