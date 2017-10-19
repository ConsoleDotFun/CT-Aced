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

//didnt use $parm bc that assumes the paramaters are divided by & symbols, this url is divided by +
var url = "https://api.everyblock.com/content/chicago/locations/" + zip_code + "/timeline/?token=44e189ef804ebea66865b04bd96fcff657f860cc"

function display(articles) {
  for (var i = 0; i < articles.length; i++) {
    //added this because I was getting an error bc some embed objects were empty
    //this just says, as long as embed is not null or undefined, carry on.
      if ( articles[i].embed != null || articles[i].embed != undefined){
        var article = $("<div>")


    //commented headlines out because I combined the URL and the headlines.
         //var headline = articles[i].title;
         //var htmlheadline = $("<div>").text(headline);
         //article.append(htmlheadline);

    //commented commentss out because most articles didnt have comments
         //var content = articles[i].attributes.comment;
         //var htmlcontent = $("<div>").text(content);
         //article.append(htmlcontent);

         //pulls headline and url from API and creates a hyperlink w/ headline as text & news url as the hyperlink
         var headline = articles[i].title;
         var url = articles[i].url;
         var htmlurl = $("<a>").text(headline).attr("href", url);
         article.append(htmlurl);


          var description = articles[i].embed.description;
          var htmlcontent = $("<div>").text(description);
          article.append(htmlcontent);

         $("#newsobject").append(article);
      }
  };
};



$.ajax({
  url: url,
  method: 'GET',
  dataType: "json"
}).done(function(data) {
  display(data.results)
  // console.log(data.results[0].embed['description']);
}).fail(function(err) {
  throw err;
});
