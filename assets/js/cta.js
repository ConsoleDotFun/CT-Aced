

var BustrackerModule = (function() { 

	//object to store details of the current request; will also be used to set preferred stop info
	var currentRequest = {
		routeNumber: null,
		direction  : null,
		stopId     : null,
		stpnm      : null
	}

	//--------------//ID selectors for display divs//--------------//
	       //change values, if needed, to match HTML//
	const idOfRouteDiv = "#routes";
	const idOfStopsDiv = "#stops";
	const idOfDirectionsDiv = "#directions";
	const idOfPanelTitleDiv = "#route-panel-title";
	//routes is a global variable in routes.js
	const arrayOfRoutes = routes;


	var prefRequest = false;
	//object to return with public methods
	var module = {};

	//--------------------//Private Methods//---------------------//

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

	//creates and displays a dropdown menu of bus routes
	routesDropdown = function(routesArray){
		var dropdown = $("<select required id='route-select' size=6>")
			.change(function(){ //event listener to call directionsDropdown once route is selected
				$(idOfStopsDiv).empty();
				var route = $(this).val();
				currentRequest.routeNumber = route;
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
		queryCTA("getdirections", ("rt="+routeNumber), (function(response){
			var directions = response["bustime-response"].directions;
			var dropdown = $("<select required id='direction-select'>");
			dropdown.append($("<option>")
				.attr("value", null)
				.text("direction of travel"))
			.change(function(){ //event listener to call stopsDropdown once direction is selected
				var direction = $(this).val();
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

	setPrefs = function(userId, prefObj) {

		//update preferences for this user on database
		database.ref(userId + "/prefs").update(prefObj);

	}

	//creates and displays a dropdown menu of bus stops on selected route
	stopsDropdown = function(routeNumber, direction){
		queryCTA("getstops", ("rt="+routeNumber+"&dir="+direction), (function(response){
			var stops = response["bustime-response"].stops;
			var dropdown = $("<select required id='stop-select' size=6>")
			.change(function(){ //event listener to call getPredictions once stop is selected
				var value = $(this).val().split(" ");
				var stopId = value[0];
				var stpnm = value.slice(1).join(" ");
				console.log('stpnm', stpnm);
				console.log('stopId', stopId);
				currentRequest.stopId = stopId;
				currentRequest.stpnm = stpnm;
				//if prefRequest, set preferences
				if (prefRequest === true) {
					return currentRequest;
				}
				console.log('currentRequest', currentRequest);
				module.getPredictions(routeNumber, stopId);
			});
		stops.forEach(function(stop){
			var option = $("<option>").attr("value", stop.stpid + " " + stop.stpnm).text(stop.stpnm);
			$(dropdown).append(option);
		});
		$(idOfStopsDiv).html(dropdown);
		}))	
	}

	//-----------------------//Public Methods//--------------------------//

	module.getPredictions = function(routeNumber, stopId){
		var predictions;
		queryCTA("getpredictions", ("rt="+routeNumber+"&stpid="+stopId), (function(response){
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

	module.getPrefs = function(){
		prefRequest = true;
		return routesDropdown(arrayOfRoutes);
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

}());//self-invocation
//end of BusModule


BustrackerModule.getPrefs();




