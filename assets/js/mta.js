$(document).ready(function(){

	var MTAkey = "6c19170e4444bcfc1017f8cec5b60d5e";
	var url = "http://datamine.mta.info/mta_esi.php?key="+MTAkey;
	const corsProxyURL = "http://cors-proxy.htmldriven.com/?url=";
	var url = (corsProxyURL + url);
	console.log('url', url);
	$.ajax({
		url:url,
		method:"GET"
	}).done(function(response){
		console.log(response);
	})







})