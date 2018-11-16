// API authorization header;
var API_KEY = 'Token token="6e2a14b847ee39bd0b0ca643b1947f5b"'; 
var quotes = []; // Here will be taken from API quotes

$(document).ready(function () {
    getRandomQuote();
    var game = $('#game');
    $("#start-btn").on("click", function () {
        $(".starting-screen").toggle();
        game.toggle();
    });
});
function getRandomQuote() {
    $.ajax({
        url: "https://favqs.com/api/qotd", //Take one random quote
        type: "GET",
        success: function (reqQuote) {
            var singleQuote = {
                author: reqQuote.quote.author,
                body: reqQuote.quote.body,
            }
            //set it to starting quote;
            $('#strating-quote-body').text(singleQuote.body); 
            $('#strating-quote-author').text(singleQuote.author);
            $('.starting-quote').css('opacity', '1');
        }
    })
}
