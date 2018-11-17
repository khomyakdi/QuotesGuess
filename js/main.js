// API authorization header;
const API_KEY = 'Token token="6e2a14b847ee39bd0b0ca643b1947f5b"';
let quotes = []; // Here will be taken from API quotes
let currentQuote = 0;
let answerLog = [];
let numberOfRightAnswers = 0;
$(document).ready(function () {
    getRandomQuote();
    let game = $('#game');
    $('#start-btn').on('click', function () {
        $('.starting-screen').hide();
        getRandomQuotes();
    });
    function getRandomQuote() {
        $.ajax({
            url: 'https://favqs.com/api/qotd', //Take one random quote
            type: 'GET',
            success: function (reqQuote) {
                const singleQuote = {
                    author: reqQuote.quote.author,
                    body: reqQuote.quote.body,
                }
                //set it to starting quote;
                $('#strating-quote-body').text(singleQuote.body);
                $('#strating-quote-author').text(singleQuote.author);
                $('.starting-quote').css('opacity', '1');
                $('#start-btn').show();
            }
        })
    }
    function getRandomQuotes() {
        $.ajax({
            url: 'https://favqs.com/api/quotes',
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', API_KEY);
                $('#loading').toggle();
            },
            success: function (reqQuotes) {
                quotes = reqQuotes.quotes.slice(0, 10);
                $('#loading').toggle();
                game.show();
                setQuestion(0);
                $('.question').show();
            }
        })
    }

    function setQuestion(index) {
        currentQuote = index;
        $('.progress').css('width', (index) * (100 / quotes.length) + '%');
        $('#question-count').text((index + 1) + '');
        $('blockquote #strating-quote-body').text(quotes[index].body);
        setVariants(index)
    }
    function setVariants(index) {
        let answers = ['0', '0', '0', '0'];
        let randPos = Math.floor(Math.random() * 3)
        answers[randPos] = quotes[index].author;
        for (let i = 0; i < 4; i++) {
            if (answers[i] == '0') {
                let randAuthor = quotes[Math.floor(Math.random() * (quotes.length - 1))].author;
                while (answers.includes(randAuthor)) {
                    randAuthor = quotes[Math.floor(Math.random() * (quotes.length - 1))].author;
                }
                answers[i] = randAuthor;
            }
        }
        $('#answer-1 label').text(answers[0]);
        $('#answer-2 label').text(answers[1]);
        $('#answer-3 label').text(answers[2]);
        $('#answer-4 label').text(answers[3]);
    }
    $('.answer-submit-btn').on('click', submitAnswer);
    function submitAnswer() {
        $('.invalid-input').hide();
        if ($('.radio-answer:has(input[type=radio]:checked)').length == 0) {
            $('.invalid-input').show();
        } else {
            submitedAnswer = $('.radio-answer:has(input[type=radio]:checked) label').text();
            if (submitedAnswer == quotes[currentQuote].author) {
                logRightAnswer(submitedAnswer);
                numberOfRightAnswers++;
            } else {
                logWrongAnswer(submitedAnswer)
            }
            nextQuestion();
        }
    }

    function logRightAnswer(submitedAnswer) {
        const answer = `
        <div class="quote">
        <h3>${currentQuote + 1}</h3>
            <blockquote>
                <q>
                    ${quotes[currentQuote].body}
                </q>
            </blockquote>
            <i class="right-answer">${quotes[currentQuote].author}</i>
        </div>
        `;
        answerLog.push(answer)//
    }
    function logWrongAnswer(submitedAnswer) {
        const answer = `
        <div class="quote">
            <h3>${currentQuote + 1}</h3>
            <blockquote>
                <q>
                    ${quotes[currentQuote].body}
                </q>
            </blockquote>
            <div class="wrong wrong-answer"><i>${submitedAnswer}</i></div>
                <i>${quotes[currentQuote].author}</i>
</div>
        `;
        answerLog.push(answer)//
    }
    function nextQuestion() {
        $('.radio-answer input[type=radio]:checked').prop('checked', false);
        if (currentQuote == quotes.length - 1) {
            showWinScreen();
            return;
        }
        currentQuote++;
        setQuestion(currentQuote);
    }
    function showWinScreen() {
        const resultPoints = (100 * numberOfRightAnswers) / quotes.length;

        $('#result-value').text(resultPoints + '%');
        answerLog.map(function (answer) {
            $('#win-screen .quotes').append(answer);
        })
        game.hide();
        $('#win-screen').show();
    }
    $('#restart-btn').on('click', newGame);
    function newGame() {

        game.hide();
        $('#loading').hide();
        $('#win-screen').hide();
        $('.starting-screen').show();
        getRandomQuote();
    }
});
