console.log("hello")

var url = "https://andruxnet-random-famous-quotes.p.mashape.com/?cat=famous&count=1";


$.ajax({
  url: url,
  method: 'GET',
  headers: {'X-Mashape-Key': 'a1BCkvQWslmshGKud614cQI6JbRyp1DVOZNjsnsNfaVOrdTSuU'},
}).done(function(data) {
  console.log(data);
  var quote = data.quote;
  console.log(quote);
  var author = data.author;
  console.log(author);
  $("#quote-content").append(quote);
  $("#quote-author").append(author);
}).fail(function(err) {
  throw err;
});
