$(document).ready(function(){

	//send a query to the CTA's bus tracker API
	function queryCTA(queryType, queryParam = "", callback){
		var queryResult;
		var language = "en";
		const apiKey = "j3yumkkQfPsQd2E3GCE3XeEAW";
		var queryURL = "http://ctabustracker.com/bustime/api/v2/"+queryType+"?key="+apiKey+"&format=json&locale="+language+"&"+queryParam;
		const corsProxyURL = "https://cors-anywhere.herokuapp.com/";
		var url = (corsProxyURL + queryURL);// Used CORS proxy to avoid “No Access-Control-Allow-Origin header”
		//ajax call to API
		$.ajax({
			url: url,
			method: "GET"
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
	function log(response){
		console.log("request successful");
		console.log("response", response);
	}


	// queryCTA("getvehicles","rt=22", log);


	//--------------------------//Utility functions//--------------------------//

	//returns an array of objects, each of which represents one of the bus routes
	function ctaRoutes(){
		console.log("ctaRoutes() called.");
		queryCTA("getroutes", "", (function(response){
			var routes = response["bustime-response"].routes;
			console.log("routes", routes);
			return routes;
		}));	
	}

	queryParams = {
		"routes": ["getroutes", "routes"],
		"directions": ["getdirections", "directions"],
		"stops": ["getstops", "stops"],
		"predictions": ["getpredictions", "prd"],
		"bulletins": ["getservicebulletins", "sb"]
	};

	// console.log(queryParams["routes"]);

	function queryCategory(category, paramObject, optionalStr = ""){
		var q = paramObject[category];
		console.log("paramObject[category]", q);
		queryCTA(q[0], optionalStr, (function(response){
			console.log("q[0]", q[0]);
			var p = response["bustime-response"][q[1]];
			console.log(p);
			return p;
		}));	
	}


	queryCategory("predictions", queryParams, "stpid=5951&top=5");


	//returns an array of (usually 2) objects, each a direction of travel of the route
	function routeDirections(routeNum){
		queryCTA("getdirections", ("rt="+routeNum), (function(response){
			var directions = response["bustime-response"].directions;
			console.log("directions", directions);
			return directions;
		}))
	}

	function getStops(routeNum, direction){
		queryCTA("getstops", ("rt="+routeNum+"&dir="+direction), (function(response){
			var stops = response["bustime-response"].stops;
			console.log("stops", stops);
			return stops;
		}))
	}

	var stops = getStops(8,"Northbound");
	console.log(stops);
	ctaRoutes();

	routeDirections("8");




})//end of $(document).ready(function(){}