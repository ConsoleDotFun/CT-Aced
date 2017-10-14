$(document).ready(function(){

	function testCall(){
		console.log("testing train api");
		var key = "a740709c663f4515a7acf141b7fac6e3";
		var queryURL = "http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key="+key+"&mapid=40380&max=5&outputType=JSON";
		const corsProxyURL = "http://cors-proxy.htmldriven.com/?url=";
		var url = (corsProxyURL + queryURL);
		console.log('url', url);
		$.ajax({
			url:url,
			method:"GET"
		}).done(function(response){
			console.log(response);
		})

	}

	testCall();






})//end of $(document).ready