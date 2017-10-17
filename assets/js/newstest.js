var config = {
    apiKey: "AIzaSyBoDzxA09zepIWCD9INLvERA63qHwd_oZ4",
    authDomain: "ct-ace.firebaseapp.com",
    databaseURL: "https://ct-ace.firebaseio.com",
    projectId: "ct-ace",
    storageBucket: "ct-ace.appspot.com",
    messagingSenderId: "310061683501"
};
  firebase.initializeApp(config);

var database = firebase.database();

function zipcode() {
  var zipcode = database.ref().currentUser.zipcode
  return zipcode
  console.log(zipcode);
}

var zip_code = "60614"

var url = "https://api.everyblock.com/content/chicago/locations/" + zip_code + "/timeline/?token=44e189ef804ebea66865b04bd96fcff657f860cc"

function display(articles) {
  for (var i = 0; i < articles.length; i++) {
    var article = $("<div>")

    var headline = articles[i].title;
    var htmlheadline = $("<div>").text(headline);
    article.append(htmlheadline);

    var content = articles[i].attributes.comment;
    var htmlcontent = $("<div>").text(content);
    article.append(htmlcontent);

    var url = articles[i].url;
    var htmlurl = $("<a>").text('Click me!').attr("href", url);
    article.append(htmlurl);

    $("#newsobject").append(article);
  }
}



$.ajax({
  url: url,
  method: 'GET',
  dataType: "json"
}).done(function(data) {
  display(data.results);
}).fail(function(err) {
  throw err;
});
