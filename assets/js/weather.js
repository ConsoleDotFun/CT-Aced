$(document).ready(function() {
  console.log("weather function is running")
;
  var zip = "60660";
  var apiKey = "7a6a7145f6a1c220db94cc631bef319e";
  var url =  "http://api.openweathermap.org/data/2.5/forecast?zip="+ zip+",&APPID="+apiKey;

  // Ajax call to weather API

  $.ajax({url: url, method: "GET"}).done(function(response){

    // assign reponse to weather weatherAPIObject
    var weatherAPIObject = response;

    // Retrive current temperature and convert it to fahrenheight
    var kelvinTemperature = weatherAPIObject.list[0].main.temp;
    var fahrenheight = (9/5)*((kelvinTemperature - 273) + 32);

    // Retrive Icon code
    var iconCode = weatherAPIObject.list[0].weather[0].icon;
    // Build Icon link
    var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

    var container = $("<div>").addClass("row");
    var img = $("<img>").attr("src", iconUrl).addClass("col-xs-6");
    var temperature = $("<div> <p> Current Temperature is: " + fahrenheight + " fahrenheight</div>").addClass("col-xs-6");

    container.append(img, temperature)

    // Append to HTML

    $(".weatherInfo").append(container)




  });






});
