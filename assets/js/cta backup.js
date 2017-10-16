
$(document).ready(function(){

//-----------------------//Global Variables//--------------------------//
	//routes is a global variable in routes.js
	var arrayOfRoutes = routes;

	//object to store details of the current request; will also be used to set preferred stop info
	var currentRequest = {
		routeNumber: null,
		direction  : null,
		stopId     : null,
		stpnm      : null
	}

//-----------------------//Functions//--------------------------//

//send a query to the CTA's bus tracker API
	function queryCTA(queryType, queryParam = "", callback){
		var queryResult;
		var language = "en";
		const apiKey = "j3yumkkQfPsQd2E3GCE3XeEAW";
		// var queryURL = "http://ctabustracker.com/bustime/api/v2/"+queryType+"?key="+apiKey+"&format=json&locale="+language+"&"+queryParam;
		var queryURL = "http://ctabustracker.com/bustime/api/v2/"+queryType+"?key=" + apiKey + '&format=json' + "&locale="+language+"&"+queryParam;
		;
		console.log('queryURL', queryURL);
		// const corsProxyURL = "http://cors-proxy.htmldriven.com/?url=";
		const corsProxyURL = "https://cors-anywhere.herokuapp.com/";
		// const corsProxyURL = "";
		var url = (corsProxyURL + queryURL);// Used CORS proxy to avoid “No Access-Control-Allow-Origin header”
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

//creates dropdown menu of bus routes from an array of routes

	function updateDisplay(interval){
		//getPredictions and update display every [interval] minutes
	}

	function getPrefs(){
		routesDropdown(arrayOfRoutes);
	}

	function routesDropdown(routesArray){
		var dropdown = $("<select required id='route-select' size=6>")
			.change(function(){
				$("#stop").empty();
				var route = $(this).val();
				console.log("route = ", route);
				currentRequest.routeNumber = route;
				console.log('currentRequest', currentRequest);
				$("#route-panel-title").html("Select a route");
				return directionDropdown($(this).val());
			});
		routesArray.forEach(function(route){
			var optionText = route.rt + "–" + route.rtnm;
			var option = $("<option>").attr("value", route.rt).text(optionText);
			$(dropdown).append(option);
		});
		$("#route").append(dropdown);
	}

//creates dropdown menu of allowed route directions
	function directionDropdown(routeNumber){
		console.log("directionDropdown("+routeNumber+") called.");
		queryCTA("getdirections", ("rt="+routeNumber), (function(response){
			console.log("response = ", response);
			var directions = response["bustime-response"].directions;
			console.log("permitted directions = ", directions);
			var dropdown = $("<select required id='direction-select'>");
			dropdown.append($("<option>")
				.attr("value", null)
				.text("direction of travel"))
			//event listener to call stopsDropdown once direction is selected
			.change(function(){
				var direction = $(this).val();
				console.log('direction', direction)
				currentRequest.direction = direction;
				if(direction !== null){
					$("#route-panel-title").html("Select your stop");
					return stopsDropdown(routeNumber, direction);
				}
			});
		directions.forEach(function(direction){
			var option = $("<option>").attr("value", direction.dir).text(direction.dir);
			$(dropdown).append(option);
		});
		$("#direction").html(dropdown);
		}))	
	}


	function stopsDropdown(routeNumber, direction){
		console.log("stopsDropdown(" + routeNumber + "," + direction + ") called");
		queryCTA("getstops", ("rt="+routeNumber+"&dir="+direction), (function(response){
			console.log(response);
			var stops = response["bustime-response"].stops;
			console.log("stops = ", stops);
			var dropdown = $("<select required id='stop-select' size=6>")
			.change(function(){
				var value = $(this).val().split(" ");
				var stopId = value[0];
				var stpnm = value.slice(1).join("");
				console.log('stpnm', stpnm);
				console.log('stopId', stopId);
				currentRequest.stopId = stopId;
				currentRequest.stpnm = stpnm;
				console.log('currentRequest', currentRequest);
				return getPredictions(routeNumber, stopId);
			});
		stops.forEach(function(stop){
			var option = $("<option>").attr("value", stop.stpid + " " + stop.stpnm).text(stop.stpnm);
			$(dropdown).append(option);
		});
		$("#stop").html(dropdown);
		}))	
	}

	function getPredictions(routeNumber, stopId){
		console.log('getPredictions('+ routeNumber +', '+ stopId+') called.');
		var predictions;
		queryCTA("getpredictions", ("rt="+routeNumber+"&stpid="+stopId), (function(response){
			console.log("getPredictions response = ", response);
			if (response["bustime-response"] === "error"){
				var error = response["bustime-response"].error[0].msg;
				console.log('error', error);
				return routeDisplay(error, true);
			} else if (response["bustime-response"] === "prd"){
				var predictions = response["bustime-response"].prd;
				console.log("predictions = ", predictions);
				return routeDisplay(predictions);
			}
		}))	
	}

	function routeDisplay(msg, isError = false){
		//display info on screen
	}

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


	//getPrefs();
	routesDropdown(arrayOfRoutes);

})//end of $(document).ready(function(){}