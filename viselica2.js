var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var wordSource = [
    new CreateWordStock("насекомые", ["комар", "муха", "гусеница", "стрекоза", "червяк"] ),
    new CreateWordStock("фрукты", ["ананас", "дыня", "гранат", "айва", "апельсин"] )
];
var guessTheme;
var guessWord = pickWord(wordSource);

var remainingLetters = guessWord.length;
var attemps = 11;
var missArray = [];

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

createGamePlace();

setupWordTable();

/**
 * Отрисовка табло и темы
 */
function setupWordTable() {
    $(".themes").html('<strong>Тема:</strong> ' + guessTheme);
    for (var i = 0; i < guessWord.length; i++) {
        $(".guessWordTable").append('<div class="guessLetterTable"></div>');
    }
}

/**
 * Отображает ход игры
 * @param guess текущая загаданная буква
 * @returns {boolean} возвращает false при нажатии кнопки "Отмена" диалогового окна или отгадывания буквы
 */
function gameStep(guess) {
    msg = "Введите, пожалуйста, букву или загаданное слово целиком. Для выхода из игры нажмите Отмена";
    var openedCharsCount; //Кол-во открытых букв в текущий ход

    if (!remainingLetters || !attemps) {
        bootbox.alert( "Было загадано слово - " + guessWord);
        return;
    }

    if ( guess !== null ) {
        guess = guess.toLowerCase();
    } else {
        $('.bootbox.modal').modal('hide');
        bootbox.alert("Пока!");
        return false;
    }

    showPlayerProgress(attemps);


    if (guess.length !== 1) {
        if (guess === guessWord) {
            $('.bootbox.modal').modal('hide');
            bootbox.alert("Поздравляем!");
            updateGameState(guess);
            return false;
        } else {
            msg = "Пожалуйста, введите одну букву либо слово целиком";
            attemps--;
            drawMen(attemps);
            showPlayerProgress(attemps);
        }
    } else {
        if (isRepeat(guess)) {
            msg = "Такую букву уже проверяли! Введите другую";
        }
        else {
            missArray.push(guess);
            openedCharsCount = updateGameState(guess);
            remainingLetters -= openedCharsCount;

            if (!remainingLetters) {
                $('.bootbox.modal').modal('hide');
                bootbox.alert("Поздравляем!");
                updateGameState(guess);
                return false;
            }

            if (openedCharsCount === 0) {
                attemps--;
                drawMen(attemps);
                showPlayerProgress(attemps);
                $(".missingLettersShow").append('<span>' + guess + ', <span>');
            } else {
                msg = "Буква '" + guess + "' есть в слове! Загадывайте следующую букву";
            }
        }
    }

    bootbox.prompt(
        msg,
        gameStep
    );
}

/**
 * Конструктор хранилища слов
 * @param theme тема загаданного слова
 * @param words массив со словами для загадывания
 */
function CreateWordStock (theme, words) {
    this.theme = theme;
    this.words = words;
}

/**
 * Отрисовка человечка
 * @param attemps количество оставшихся попыток
 */
function pickWord (wordSource) {
    var guessObj = wordSource[ Math.floor( Math.random() * wordSource.length ) ];
    guessTheme = guessObj.theme;
    return guessObj.words[ Math.floor( Math.random() * guessObj.words.length ) ];
}

/**
 * Отрисовка счетчика попыток
 * @param attemps количество оставшихся попыток
 */
function showPlayerProgress(attemps) {
    $("#attempsCounter").html('<strong>Осталось попыток:</strong> ' + attemps);
}

/**
 * Отрисовка первоначального поля с виселицей
 */
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

/**
 * Отрисовка человечка
 * @param attemps количество оставшихся попыток
 */
function drawMen (attemps) {
    switch(attemps) {
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

/**
 * Отрисовка круга
 * @param x координата центра окружности по оси Ox
 * @param y координата центра окружности по оси Oy
 * @param radius радиус окружности
 * @param fillCircle булево значение: true - не заливать окружность цветом, false - нет
 */
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

/**
 * Возвращает число открытых букв и отрисовывает табло
 * @param guess текущая загаданная буква
 * @returns {number} число открытых букв в слове
 */
function updateGameState(guess) {
    var a = 0;
    for (var j = 0; j < guessWord.length; j++) {
        if (guessWord[j] === guess) {
            $('.guessWordTable').children().eq(j).html(guess);
            a++;
        }
        else if (guess.length == guessWord.length && guessWord[j] == guess[j]) {
            $('.guessWordTable').children().eq(j).html(guess[j]);
        }
    }
    return a;
}

/**
 * Проверяет на повторный ввод буквы
 * @param guess текущая загаданная буква
 * @returns {boolean} возвращает true в случае ввода ранее введенной буквы
 */
function isRepeat (guess) {
    for (var i = 0, len = missArray.length; i < len; i++) {
        if ( missArray[i] === guess ) {
            return true;
        }
    }
    return false;
}