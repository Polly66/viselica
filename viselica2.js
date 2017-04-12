$(function () {
    $(".start-game").click(function (){
        $(".game").css("display","block");

        $(".start-game").css("display","none");

        bootbox.prompt(
            "Введите, пожалуйста, букву или загаданное слово целиком. Для выхода из игры нажмите Отмена",
            gameStep
        );
    });
});

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
createGamePlace();

var wordSource = [];
var source1 = new CreateWordStock("насекомые", ["комар", "муха", "гусеница", "стрекоза", "червяк"] );
var source2 = new CreateWordStock("фрукты", ["ананас", "дыня", "гранат", "айва", "апельсин"] );

wordSource[0] = source1;
wordSource[1] = source2;

var guessTheme;
var guessWord = pickWord(wordSource);
$(".themes").html('<strong>Тема:</strong> ' + guessTheme);

setupWordTable(guessWord);

function setupWordTable( guessWord ) {
    for (var i = 0; i < guessWord.length; i++) {
        $(".guessWordTable").append('<div class="guessLetterTable"></div>');
    }
}

var remainingLetters = guessWord.length;
var attemps = 11;
var missArray = [];


function gameStep(guess) {
    msg = "Введите, пожалуйста, букву или загаданное слово целиком. Для выхода из игры нажмите Отмена";

    if (remainingLetters > 0 && attemps > 0) {
        showPlayerProgress(attemps);

        if ( guess !== null ) {
            var lowerGuess = guess.toLowerCase();
        } else {
            $('.bootbox.modal').modal('hide');
            bootbox.alert("Пока!");
            return false;
        }

        if (lowerGuess.length !== 1) {
            if (lowerGuess === guessWord) {
                $('.bootbox.modal').modal('hide');
                bootbox.alert("Поздравляем!");
                return false;
            } else {
                msg = "Пожалуйста, введите одну букву либо слово целиком";
                attemps--;
                drawMen(attemps);
                showPlayerProgress(attemps);
            }
        } else {
            remainingLetters -= updateGameState(lowerGuess, guessWord);

            if (updateGameState(lowerGuess, guessWord) === 0 && !isRepeat(lowerGuess)) {
                attemps--;
                drawMen(attemps);
                showPlayerProgress(attemps);
                $(".missingLettersShow").append('<span>' + lowerGuess + ', <span>');
                missArray.push(lowerGuess);
            } else {
                msg = "Такую букву уже проверяли! Введите другую";
            }

        }

        bootbox.prompt(
            msg,
            gameStep
        );
    } else {
        bootbox.alert( "Было загадано слово - " + guessWord);
    }
}


function CreateWordStock (theme, words) {
    this.theme = theme;
    this.words = words;
};

function pickWord (arr) {
    var guessObj = arr[ Math.floor( Math.random() * arr.length ) ];
    guessTheme = guessObj.theme;
    return guessObj.words[ Math.floor( Math.random() * arr.length ) ];
}

function showPlayerProgress(attemps) {
    $("#attempsCounter").html('<strong>Осталось попыток:</strong> ' + attemps);
}

function createGamePlace () {
    ctx.strokeStyle = "Red";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(30, 150);
    ctx.lineTo(70,150);
    ctx.moveTo(50, 150);
    ctx.lineTo(50, 20);
    ctx.lineTo(150, 20);
    ctx.stroke();
    ctx.strokeStyle = "Black";
}

function drawMen (a) {
    switch(a) {
        case 10:
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(30, 150);
            ctx.lineTo(50, 130);
            ctx.stroke();
            break;
        case 9:
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(70, 150);
            ctx.lineTo(50, 130);
            ctx.stroke();
            break;
        case 8:
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(50, 40);
            ctx.lineTo(70, 20);
            ctx.stroke();
            break;
        case 7:
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(150, 20);
            ctx.lineTo(150, 40);
            ctx.stroke();
            break;
        case 6:
            circle(150, 60, 20, false);
            break;
        case 5:
            circle(150, 60, 20, true);
            break;
        case 4:
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(150, 80);
            ctx.lineTo(150, 120);
            ctx.stroke();
            break;
        case 3:
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(150, 100);
            ctx.lineTo(130, 90);
            ctx.stroke();
            break;
        case 2:
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(150, 100);
            ctx.lineTo(170, 90);
            ctx.stroke();
            break;
        case 1:
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(150, 120);
            ctx.lineTo(130, 150);
            ctx.stroke();
            break;
        case 0:
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(150, 120);
            ctx.lineTo(170, 150);
            ctx.stroke();
            break;
    }
}

function circle (x, y, radius, fillCircle)  {
    if (fillCircle) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.stroke();
}

function updateGameState(lowerGuess, guessWord) {
    var a = 0;
    for (var j = 0; j < guessWord.length; j++) {
        if (guessWord[j] === lowerGuess) {
            $('.guessWordTable').children().eq(j).html(lowerGuess);
            a++;
        }
    }
    return a;
}

function isRepeat (a) {
    for (var i = 0, len = missArray.length; i < len; i++) {
        if ( missArray[i] === a ) {
            return true;
        }
    }
    return false;
}